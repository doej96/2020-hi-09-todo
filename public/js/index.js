/*********** 글로벌 설정 ***********/
var auth = firebase.auth();
var db = firebase.database();
var user = null;
var ref = null;
var google = new firebase.auth.GoogleAuthProvider();
var facebook = new firebase.auth.FacebookAuthProvider();

/*********** 사용자 함수 ***********/
function dbInit() {
	db.ref('root/todo/'+user.uid).on('child_added', onAdd);
	db.ref('root/todo/'+user.uid).on('child_removed', onRev);
	db.ref('root/todo/'+user.uid).on('child_changed', onChg);
}

function addHTML(k, v) {
	var html = '<li id="'+k+'" class="'+(v.checked ? 'opacity':'')+'">';
	if(v.checked) {
		html += '	<i class="far fa-circle" onclick="onCheck(this, true);"></i>';
		html += '	<i class="active far fa-check-circle" onclick="onCheck(this, false);"></i>';
	} else{
		html += '	<i class="active far fa-circle" onclick="onCheck(this, true);"></i>';
		html += '	<i class="far fa-check-circle" onclick="onCheck(this, false);"></i>';
	}
	html += '	<input type="text" class="ml-3" value="'+v.task+'" onchange="onChange(\''+k+'\', this);">';
	//form만 onchange요소 가지고있음
	html += '	<div class="date">'+moment(v.createdAt).format('llll')+'</div>';
	html += '<button class="btn btn-sm btn-danger bt-delete" onclick="onDelete">삭제</button>';
	html += '</li>';
	
	var $li = $(html).prependTo($(".list-wrap"));
	$li.css("opacity"); /* 그냥 주면 transition 안먹음, 한 번 인식시켜준 다음에 css 변경 */
	$li.css("opacity",1);
	return $li;
}

/*********** 이벤트 콜백 ***********/
function onChange(k, v) {
	db.ref('root/todo/'+user.uid+'/'+k).update({ task: v.value })
}

function onDelete(key) {
	db.ref('root/todo/'+user.uid+'/'+key).remove();
}

var timeout = null; 
function onCheck(el, chk) {
	//console.log(el, chk); //i(this)와 check true/false
	$(el).siblings('i').toggleClass('active');
	$(el).toggleClass('active');

	if(chk) {
		timeout = setTimeout(function(){
			$(el).parent().css('opacity', 0);
			setTimeout(function(){
				$(el).parent().remove();
				db.ref('root/todo/'+user.uid+'/'+$(el).parent().attr('id')).update({
					checked: true
				});
			},750)
		},3000);
	}
	else {
		clearTimeout(timeout);
	}
}

function onDoneClick() {
	$('.bt-done').toggleClass('active');
	var ref = db.ref('root/todo/'+user.uid);
	if($('.bt-done').hasClass('active')) { //감추기
		ref.orderByChild('checked').equalTo(false).once('value').then(onGetData);
		//once:데이터 다 가져옴, then:성공한다면, catch:실패한다면
	}
	else { //보이기
		ref.once('value').then(onGetData);
	}
}

function onGetData(r) {
	$('.list-wrap').empty();
	r.forEach(function(v){
		if(v.val().checked) addHTML(v.key, v.val());
	});
	r.forEach(function(v){
		if(!v.val().checked) addHTML(v.key, v.val());
	});

	for(var i in r.val()) {
		var $li = $(getHTML(i, r.val()[i])).prependTo($(".list-wrap"));
		//console로 r.val()찍어보면 i가 키값
		$li.css("opacity");
		$li.css("opacity",1);
	}
}

function onSubmit(f) {
	console.log(f.task.value);
	var data = {
		task : f.task.value,
		createdAt: new Date().getTime(),
		checked: false,
	}
	if(f.task.value !== '') db.ref('root/todo/'+user.uid).push(data);
	return false;
}

function onAdd(r) {
	//console.log(r.key); //key:고유 아이디
	//console.log(r.val()); //데이터
	if(!r.val().checked) addHTML(r.key, r.val());
	$(".add-wrap")[0].reset(); //reset : form 초기화해주는 자바스크립트 명령
	//document.querySelector(".add-wrap").reset();
}

function onRev(r) {
	console.log(r.val());
}

function onChg(r) {
	
}


function onAuthChg(r) {
	user = r;
	if(r) {
		console.log(r);
		$('.sign-wrap .icon img').attr('src', user.photoURL);
		$('.sign-wrap .email').html(user.email);
		$('.modal-wrapper.auth-wrapper').hide();
		$('#btLogout').show();
		$('.sign-wrap').show();
		dbInit();
	}
	else {
		$('.sign-wrap .icon img').attr('src', 'http://via.placeholder.com/36');
		$('.sign-wrap .email').html('');
		$('.modal-wrapper.auth-wrapper').css('display','flex');
		$('#btLogout').css('display','none');
		$('.sign-wrap').hide();
	}
}

function onGoogleLogin() {
	auth.signInWithPopup(google);
}

function onLogout() {
	auth.signOut();
}

/*********** 이벤트 등록 ***********/
auth.languageCode = 'ko';
auth.onAuthStateChanged(onAuthChg);
moment.locale('ko');

$('#btGoogleLogin').click(onGoogleLogin);
$('#btLogout').click(onLogout);
