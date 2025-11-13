// Portfolio JavaScript Functions

// 프로젝트 생성 함수
function createProject(projectId, projectName, description, imageSrc, projectLink, modalType = 'html') {
    const modalTypeFunction = modalType === 'pdf' ? 'openPDFModal' : 'openModal';
    
    return `
        <div class="project shadow-large" onclick="${modalTypeFunction}('${projectId}')">
            <div class="project-image">
                <img src="${imageSrc}" width="300">
            </div>
            <div class="project-info">
                <h3>${projectName}</h3>
                <p>${description}</p>
                <a href="${projectLink}" target="_blank">View Project</a>
            </div>
        </div>
        <div id="${projectId}Modal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('${projectId}')">&times;</span>
                <div id="${projectId}-modalContent"></div>
            </div>
        </div>
    `;
}

// 프로젝트 데이터 정의
const projects = [
    {
        id: 'ProjectCube',
        name: 'Project Cube',
        description: '만들래 10분게임 콘테스트를 위해 만들었던 게임입니다. 블럭을 굴려서 다가오는 몬스터를 저지하는 캐주얼 퍼즐게임으로 안드로이드를 주 플랫폼으로 PC와 웹 까지 지원하도록 제작하였습니다.',
        image: 'images/BlockingMain.png',
        link: './Projects/ProjectCube.pdf',
        modalType: 'pdf'
    },
    {
        id: 'jjengine',
        name: 'JJEngine',
        description: '대학에서 진행한 게임 엔진 프로젝트입니다. 작은 게임을 구현해 볼 수 있는 수준의 엔진을 목표로 했고 유니티를 모티브로 C# 스크립트와 에디터를 제공합니다.',
        image: 'images/JJEngineThumbnail.png',
        link: './Projects/jjengine.html',
        modalType: 'html'
    },
    {
        id: 'SpyTheMan',
        name: 'Spy The Man',
        description: '대학에서 진행한 4인 게임 프로젝트 입니다. 건물의 목표지점까지 적대적인 NPC들에게 잡히지 않고 도달하는 게임입니다. 자체엔진에서 작업했고 엔진과 AI 파트를 주로 담당했습니다.',
        image: 'images/SpyTheManThumb.png',
        link: './Projects/SpyTheMan.pdf',
        modalType: 'pdf'
    },
    {
        id: 'AcademicProjects',
        name: 'Academic projects',
        description: '학부 시절 과제로 진행했던 프로젝트들 입니다. WFC를 통한 절차적 생성 알고리즘과 기본적인 그래픽 테크닉, 반사와 굴절, 바운딩 볼륨과 공간 분할 테크닉 등의 그래픽스 프로젝트가 등록되어 있습니다.',
        image: 'images/Graphics.png',
        link: './Projects/AcademicProjects.html',
        modalType: 'html'
    },
    {
        id: 'ToyProjects',
        name: 'Toy projects',
        description: '기술 학습용 프로젝트',
        image: 'images/Graphics.png',
        link: './Projects/ToyProjects.html',
        modalType: 'html'
    }
];

// 페이지 로드 시 프로젝트 생성
document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        projects.forEach(project => {
            const projectHTML = createProject(
                project.id,
                project.name,
                project.description,
                project.image,
                project.link,
                project.modalType
            );
            projectsContainer.insertAdjacentHTML('beforeend', projectHTML);
        });
    }
});

// 모달 열기 함수
function openModal(projectId) {
    document.getElementById(projectId + 'Modal').style.display = "block";
    document.body.classList.add('modal-open');
    
    // 프로젝트 페이지 내용 불러오기
    fetch(`./Projects/${projectId}.html`)
        .then(response => response.text())
        .then(html => {
            // 임시 div를 생성하여 HTML 파싱
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // 필요한 내용만 선택 (예: article 또는 main 태그 내용)
            const content = tempDiv.querySelector('article') || tempDiv.querySelector('main') || tempDiv.querySelector('.content');
            
            if (content) {
                document.getElementById(projectId + '-modalContent').innerHTML = content.innerHTML;
            } else {
                // article이나 main 태그가 없는 경우 body의 내용을 가져옴
                const bodyContent = tempDiv.querySelector('body');
                document.getElementById(projectId + '-modalContent').innerHTML = bodyContent ? bodyContent.innerHTML : html;
            }
            
            // AcademicProjects의 경우 목차 기능을 위한 스크립트 실행
            if (projectId === 'AcademicProjects') {
                // 목차 관련 함수들을 전역으로 추가
                window.toggleTOC = function() {
                    const sidebar = document.getElementById('tocSidebar');
                    const overlay = document.getElementById('tocOverlay');
                    
                    if (sidebar && overlay) {
                        sidebar.classList.toggle('open');
                        overlay.classList.toggle('show');
                    }
                };
                
                window.scrollToProject = function(projectId) {
                    const element = document.getElementById(projectId);
                    if (element) {
                        element.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                        // 목차 닫기
                        window.toggleTOC();
                    }
                };
                
                // ESC 키로 목차 닫기
                document.addEventListener('keydown', function(event) {
                    if (event.key === 'Escape') {
                        const sidebar = document.getElementById('tocSidebar');
                        if (sidebar && sidebar.classList.contains('open')) {
                            window.toggleTOC();
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.getElementById(projectId + '-modalContent').innerHTML = '내용을 불러오는데 실패했습니다.';
        });
}

// 모달 닫기 함수
function closeModal(projectId) {
    document.getElementById(projectId + 'Modal').style.display = "none";
    document.body.classList.remove('modal-open');
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        document.body.classList.remove('modal-open');
    }
}

// 모달 내부 클릭 시 이벤트 전파 중단
document.querySelectorAll('.modal-content').forEach(modal => {
    modal.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

// 프로필 이미지 변경 함수
function changeImage(imageElement) {
    if (imageElement.src.indexOf("JunsuJang.png") !== -1) {
        imageElement.src = "./images/ChillGuy.png";
    } else {
        imageElement.src = "./images/JunsuJang.png";
    }
}

// PDF 모달 열기 함수
function openPDFModal(projectId) {
    document.getElementById(projectId + 'Modal').style.display = "block";
    document.body.classList.add('modal-open');
    
    // PDF 파일을 iframe으로 표시
    const modalContent = document.getElementById(projectId + '-modalContent');
    modalContent.innerHTML = `<iframe src="./Projects/${projectId}.pdf" style="width: 100%; height: 80vh; border: none;"></iframe>`;
}