document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const welcomeMsg = document.getElementById("welcomeMsg");
    const infoForm = document.getElementById("infoForm");
    const homeContainer = document.querySelector(".home-container");

    // Custom alert/confirm modal
    const createModal = (message, type, onConfirm = null) => {
        // Check if a modal already exists to prevent duplicates
        if (document.querySelector('.custom-modal-overlay')) {
            return;
        }
        const overlay = document.createElement('div');
        overlay.className = 'custom-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'custom-modal';

        const messageP = document.createElement('p');
        messageP.textContent = message;

        modal.appendChild(messageP);

        if (type === 'alert') {
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '확인';
            closeBtn.onclick = () => overlay.remove();
            modal.appendChild(closeBtn);
        } else if (type === 'confirm') {
            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = '확인';
            confirmBtn.onclick = () => {
                if (onConfirm) 
                    onConfirm();
                overlay.remove();
            };
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '취소';
            cancelBtn.onclick = () => overlay.remove();
            modal.appendChild(cancelBtn);
            modal.appendChild(confirmBtn);
        }

        overlay.appendChild(modal);
        document
            .body
            .appendChild(overlay);
    };
    // CSS for the modal
    const modalStyle = document.createElement('style');
    modalStyle.innerHTML = `.custom-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .custom-modal {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            text-align: center;
        }
        .custom-modal button {
            margin: 5px;
            padding: 8px 16px;
            cursor: pointer;
        }
    `;
    document
        .head
        .appendChild(modalStyle);

    // 회원가입
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document
                .getElementById("signupName")
                .value;
            const classNo = document
                .getElementById("signupClassNo")
                .value;
            const password = document
                .getElementById("signupPassword")
                .value;
            const confirm = document
                .getElementById("signupConfirm")
                .value;

            if (password !== confirm) {
                createModal("비밀번호가 일치하지 않습니다 ❌", 'alert');
                return;
            }

            // 기존 users 가져오기
            let users = JSON.parse(localStorage.getItem("users")) || [];

            // 중복 체크
            if (users.some(u => u.classNo === classNo)) {
                createModal("이미 등록된 학년반번호입니다 ❌", 'alert');
                return;
            }

            // 새 유저 추가
            users.push({name, classNo, password});

            // 저장
            localStorage.setItem("users", JSON.stringify(users));

            createModal("회원가입이 완료되었습니다 ✅", 'alert');
            window.location.href = "index.html";
        });
    }

    // 로그인
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const classNo = document
                .getElementById("loginClassNo")
                .value;
            const password = document
                .getElementById("loginPassword")
                .value;

            let users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.classNo === classNo && u.password === password);

            if (user) {
                sessionStorage.setItem("isLoggedIn", "true");
                sessionStorage.setItem("currentUser", user.name);
                window.location.href = "home.html";
            } else {
                createModal("학년반번호 또는 비밀번호가 잘못되었습니다 ❌", 'alert');
            }
        });
    }

    // 홈 화면
    if (welcomeMsg) {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn");
        const currentUser = sessionStorage.getItem("currentUser");
        if (!isLoggedIn) {
            window.location.href = "index.html";
        } else {
            welcomeMsg.textContent = `${currentUser}님, 반갑습니다!`;
            // 홈 화면이 데스크탑 화면에 맞게 채워지도록 클래스 추가
            if (homeContainer) {
                homeContainer
                    .classList
                    .add("full-screen-content");
            }
        }
    }

    // 시간표 페이지 (정보 입력)
    if (infoForm) {
        infoForm.addEventListener("submit", (e) => {
            e.preventDefault();
            // 과목 페이지로 이동
            window.location.href = "subject.html";
        });
    }

    // 로그아웃
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.clear();
            window.location.href = "index.html";
        });
    }
});
