/*********** 글로벌 설정 ***********/
var auth = firebase.auth();
var db = firebase.database();
var user = null;
var ref = null;
var google = new firebase.auth.GoogleAuthProvider();
var facebook = new firebase.auth.FacebookAuthProvider();

/*********** 이벤트 등록 ***********/
auth.languageCode = 'ko';
auth.onAuthStateChanged(onAuthChg);

$('#btGoogleLogin').click(onGoogleLogin);
$('#btLogout').click(onLogout);

/*********** 이벤트 콜백 ***********/
function onAuthChg(r) {
	if(r) {
		user = r;
		console.log(r);
		$('.sign-wrap .icon img').attr('src', user.photoURL);
		$('.sign-wrap .email').html(user.email);
		$('.modal-wrapper.auth-wrapper').hide();
		$('#btLogout').show();
		dbInit();
	}
	else {
		user = null;
		$('.sign-wrap .icon img').attr('src', 'http://via.placeholder.com/36');
		$('.sign-wrap .email').html('');
		$('.modal-wrapper.auth-wrapper').css('display','flex');
		$('#btLogout').css('display','none');
	}
}

function onGoogleLogin() {
	auth.signInWithPopup(google);
}

function onLogout() {
	auth.signOut();
}

function onAdded(r) {
	$('.list-wrapper').prepend('<div style="padding: 1em; border: 1px solid #ccc">'+r.val().comment+'</div>')
}

function onSubmit(f) {
	var comment = f.comment.value;
	ref.push({
		comment: comment  //comment: (내가 쓴 내용인)comment <- realtime database json(ref)에 저장됨
	})
	return false;
}

/*********** 사용자 함수 ***********/
function dbInit() {
	ref = db.ref('root/todo/'+user.uid);
	ref.on('child_added', onAdded);
}
