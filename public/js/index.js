$(document).ready(function() {
    $('.main-screen').fadeIn(1000).css('display', 'flex');
    $('input').attr('autocomplete','off');

    //userSessionCheck();

    $('#openFindPassword').click(function() {
        $('.main-screen-right').css({ 'transition': '0.5s', 'filter': 'blur(2px)', 'pointer-events': 'none'}, 500);
        $('.find-password-dialog').fadeIn(500).css('display', 'flex');
    });

    function closeFindPassword() {
        $('.main-screen-right').css({ 'transition': '0.5s', 'filter': '', 'pointer-events': ''}, 500);
        $('.find-password-dialog').fadeOut(500, function() {
            $('#findPasswordInput').val('');
            $('.main-screen-right').css('transition', '');
        });
    }

    $('#closeFindPassword').click(function() {
        closeFindPassword();
    });

    function firebaseSendPasswordResetEmail() {
        let email = $('#findPasswordInput').val();
        firebaseAuth.sendPasswordResetEmail(email).then(function() {
            alert(email + '로 비밀번호 재설정 이메일을 보냈습니다.');
            closeFindPassword();
        }).catch(function(error) {
            switch (error.code) {
                case 'auth/invalid-email':
                    alert('올바른 이메일 형식이 아닙니다.');
                    break;
                case 'auth/user-not-found':
                    alert('존재하지 않는 사용자입니다. 회원가입을 진행해주세요.');
                    closeFindPassword();
                    break;
            }
        });
    }

    function userSessionCheck() {
        firebaseAuth.onAuthStateChanged(function (user) {
            if (user) {
                let ref = firebaseDatabase.ref('users/' + user.uid);
                ref.once('value').then(function(snapshot) {
                    $('.main-screen').fadeOut(1000, function() {
                        $('.login-success-screen').fadeIn(500, function() {
                            $('.checkmark').animate({ width: '60px', height: '60px', top: '29px' }, 500, function() {
                                $('#loginNickname').text(snapshot.val().nickname + ' 님');
                                $('#welcomeMsg').fadeIn(500, function() {
                                    $('.login-success-screen').delay(500).animate({ top: '-100%'}, 1000, function() {
                                        window.location.href = "main.html";
                                    });
                                });
                            });
                        }).css('display', 'flex');
                    });
                });
            }
        });
    }

    $('#findPassword').click(function() {
        firebaseSendPasswordResetEmail();
    });

    $('.find-password-dialog').keypress(function(e) {
        if (e.keyCode === 13) {
            firebaseSendPasswordResetEmail();
        }
    })

    $('#mainJoinBtn').click(function() {
        $('#loginScreen').fadeOut(250, function() {
            $('#registerScreen').fadeIn(250, function() {
                $('input').val('');
            }).css('display', 'flex');
        });
    });

    $('#cancelJoinBtn').click(function() {
        $('#registerScreen').fadeOut(250, function() {
            $('#loginScreen').fadeIn(250, function() {
                $('input').val('');
            });
        });
    });

    function firebaseJoin() {
        let email = $('#email').val();
        let password = $('#password').val();
        let passwordConfirm = $('#passwordConfirm').val();
        let nickname = $('#nickname').val();

        if (email === '' || password === '' || passwordConfirm === '' || nickname === '') {
            alert('입력되지 않은 정보가 있습니다.');
        } else if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
        } else {
            firebaseAuth.createUserWithEmailAndPassword(email, password).then(function(user) {
                user = firebaseAuth.currentUser;
                logUser(user);
            }, function(error) {
                switch (error.code) {
                    case 'auth/invalid-email':
                        alert('올바른 이메일 형식이 아닙니다.');
                        break;
                    case 'auth/weak-password':
                        alert('비밀번호는 최소 6자리 이상이어야 합니다.');
                        break;
                    case 'auth/email-already-in-use':
                        alert('이미 사용 중인 이메일입니다.');
                        break;
                }
            });

            function logUser(user) {
                let ref = firebaseDatabase.ref('users/' + user.uid);
                let obj = {
                    nickname: nickname,
                };
                ref.set(obj);
                alert('회원가입이 완료되었습니다.');
                $('#registerScreen').fadeOut(250, function() {
                    $('input').val('');
                    $('#loginEmail').val(email);
                    $('#loginScreen').fadeIn(250);
                });
            }
        }        
    }

    $('#joinBtn').click(function() {
        firebaseJoin();
    });

    $('#registerForm').keypress(function(e) {
        if (e.keyCode === 13) {
            firebaseJoin();
        }
    })

    $('#loginBtn').click(function() {
        firebaseLogin();
    });

    $('#loginForm').keypress(function(e) {
        if (e.keyCode === 13) {
            firebaseLogin();
        }
    });

    function firebaseLogin() {
        let email = $('#loginEmail').val();
        let password = $('#loginPassword').val();

        firebaseAuth.signInWithEmailAndPassword(email, password).then(function(user) {
            user = firebaseAuth.currentUser;
            let ref = firebaseDatabase.ref('users/' + user.uid);
            ref.once('value').then(function(snapshot) {
                $('.main-screen').fadeOut(1000, function() {
                    $('.login-success-screen').fadeIn(500, function() {
                        $('.checkmark').animate({ width: '60px', height: '60px', top: '29px' }, 500, function() {
                            $('#loginNickname').text(snapshot.val().nickname + ' 님');
                            $('#welcomeMsg').fadeIn(500, function() {
                                $('.login-success-screen').delay(500).animate({ top: '-100%'}, 1000, function() {
                                    window.location.href = "main.html";
                                });
                            });
                        });
                    }).css('display', 'flex');
                });
            });
        }).catch(function(error) {
            switch (error.code) {
                case 'auth/invalid-email':
                    alert('올바른 이메일 형식이 아닙니다.');
                    break;
                case 'auth/wrong-password':
                    alert('올바르지 않은 비밀번호입니다.');
                    break;
                case 'auth/user-not-found':
                    alert('존재하지 않는 사용자입니다. 회원가입을 진행해주세요.');
                    $('input').val('');
            }
        });
    }

});