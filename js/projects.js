// Academic Projects 목차 기능 JavaScript

// 목차 토글 함수
function toggleTOC() {
    const sidebar = document.getElementById('tocSidebar');
    const overlay = document.getElementById('tocOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }
}

// 프로젝트로 스크롤하는 함수
function scrollToProject(projectId) {
    const element = document.getElementById(projectId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        // 목차 닫기
        toggleTOC();
    }
}

// ESC 키로 목차 닫기
function setupTOCKeyboard() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const sidebar = document.getElementById('tocSidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                toggleTOC();
            }
        }
    });
}

// 목차 기능 초기화
function initTOC() {
    // 전역 함수로 등록 (모달에서도 사용할 수 있도록)
    window.toggleTOC = toggleTOC;
    window.scrollToProject = scrollToProject;
    
    // 키보드 이벤트 설정
    setupTOCKeyboard();
}

// DOM이 로드되면 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTOC);
} else {
    initTOC();
}