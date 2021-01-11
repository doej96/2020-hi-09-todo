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

/*********** 이벤트 콜백 ***********/
function onAdd(r) {
	console.log(r.val());
}

function onRev(r) {
	console.log(r.val());
}

function onChg(r) {
	console.log(r.val());
}


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

/*********** 이벤트 등록 ***********/
auth.languageCode = 'ko';
auth.onAuthStateChanged(onAuthChg);

$('#btGoogleLogin').click(onGoogleLogin);
$('#btLogout').click(onLogout);
