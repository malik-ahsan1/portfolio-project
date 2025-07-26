const isMobile =
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );

const PAGE_INFO = {
    1: {
        title: 'BITMEX',
        description:
            'BitMEX is a cryptocurrency exchange and derivative trading platform. I led the design team to enhance user experience and interface, focusing on security and usability.',
        year: '20',
        role: 'Lead Designer',
        services: ['UI/UX Design', 'User Research'],
        img: 'https://valentincheval.design/_astro/bitmex-cover.DpIAWMTO_1rVh1Q.webp',
    },
    2: {
        title: 'DEFICHAIN',
        description:
            'DefiChain is a blockchain platform for decentralized finance applications. My role involved designing intuitive interfaces for complex financial products.',
        year: '21',
        role: 'UI/UX Designer',
        services: ['UI/UX Design', 'Prototyping'],
        img: 'https://valentincheval.design/_astro/define-hero.D97LaZGw_ZaAv2R.webp',
    },
    3: {
        title: 'TYME BANK',
        description:
            'Tyme Bank is a digital bank in South Africa. I contributed to the design of their mobile banking app, ensuring a seamless user experience.',
        year: '22',
        role: 'Product Designer',
        services: ['UI/UX Design', 'User Testing'],
        img: 'https://valentincheval.design/_astro/gotymebank.D2jICiWb_Z8ICOc.webp',
    },
};

function loadImagesMap() {
    // Image Map
    const imagesContainer = document.getElementById('images-container');

    Object.entries(PAGE_INFO).forEach(([key, project], index) => {
        const isFirst = index === 0;
        const imageMask = document.createElement('div');
        imageMask.className = `image-mask overflow-hidden ${
            isFirst ? 'h-[94px] rounded-none' : 'h-[0px] rounded-full'
        } w-[74px] p-[2px] bg-gray-700`;

        const imageInner = document.createElement('div');
        imageInner.className = `image-inner relative h-full w-full ${
            isFirst ? 'border-[4px]' : 'border-[0px]'
        } border-black`;

        const image = document.createElement('div');
        image.className = `image absolute inset-0 bg-[url('${project.img}')] bg-cover bg-center blur-[0.8px]`;

        // Nesting
        imageInner.appendChild(image);
        imageMask.appendChild(imageInner);
        imagesContainer.appendChild(imageMask);
    });
}

function loadProjectNum() {
    const container = document.querySelector('.rotating-numbers');
    const totalProjs = document.querySelector('.total-projs');

    totalProjs.innerHTML = `&nbsp;/ 0${Object.keys(PAGE_INFO).length}`;

    for (let i = 0; i < Object.keys(PAGE_INFO).length; i++) {
        const span = document.createElement('span');
        if (i != 0) {
            span.className = 'translate-y-[100%] opacity-0';
        }
        span.style.gridArea = '1/1/2/2';
        span.textContent = i + 1;
        container.appendChild(span);
    }
}

function loadProjectImages() {
    const imagesContainer = document.querySelector(
        isMobile ? '.div2-mobile' : '.images'
    );

    Object.entries(PAGE_INFO).forEach(([key, project], index) => {
        const isFirst = index === 0;
        const card = document.createElement('div');
        card.classList.add(
            isMobile ? 'card-mobile' : 'card',
            'h-full',
            'w-full',
            'absolute',
            'top-0',
            'left-0'
        );
        card.style.clipPath = isFirst
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            : 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)';

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'img-wrapper h-full w-full';
        imgWrapper.style.transformOrigin = '25% 25%';
        imgWrapper.style.transform = isFirst ? 'scale(1)' : 'scale(1.4)';

        const img = document.createElement('img');
        img.className = isFirst
            ? 'h-full w-full object-cover object-center'
            : 'h-full w-full object-cover object-center translate-x-1/2 translate-y-1/2';
        img.src = project.img;
        img.alt = project.title;

        imgWrapper.appendChild(img);
        card.appendChild(imgWrapper);
        imagesContainer.appendChild(card);
    });
}

function loadProjectRole() {
    const container = document.querySelector('.rotating-roles');

    Object.entries(PAGE_INFO).forEach(([key, project], index) => {
        const isFirst = index === 0;
        const span = document.createElement('span');
        span.className = isFirst ? '' : 'translate-y-[100%] opacity-0';
        span.style.gridArea = '1/1/2/2';
        span.textContent = project.role;
        container.appendChild(span);
    });
}

function loadProjectServices() {
    const container = document.querySelector('.rotating-services');

    Object.entries(PAGE_INFO).forEach(([key, project], index) => {
        const isFirst = index === 0;
        const span = document.createElement('span');
        span.className = isFirst ? '' : 'translate-y-[100%] opacity-0';
        span.style.gridArea = '1/1/2/2';
        span.innerHTML = project.services.join('<br>');
        container.appendChild(span);
    });
}

function loadProjectName() {
    const container = document.querySelector(
        isMobile ? '.names-mobile' : '.rotating-names'
    );

    Object.entries(PAGE_INFO).forEach(([key, project], index) => {
        const isFirst = index === 0;
        const div = document.createElement('div');
        div.className = isFirst
            ? isMobile
                ? 'name active shrink-0'
                : ''
            : isMobile
            ? 'name shrink-0'
            : 'translate-y-[100%] opacity-0';
        if (!isMobile) {
            div.style.gridArea = '1/1/2/2';
        }
        div.innerHTML = project.title;
        container.appendChild(div);
    });
}

function loadProjectDesc() {
    const container = document.querySelector(isMobile ? '.rotating-descriptions-mob' : '.rotating-descriptions');

    Object.entries(PAGE_INFO).forEach(([key, project], index) => {
        const span = document.createElement('span');
        span.className = 'desc-block';

        const p = document.createElement('p');
        p.innerText = project.description;
        span.appendChild(p);
        container.appendChild(span);
    });
}

function loadProjectYear() {
    const container = document.querySelector(
        isMobile ? '.years-mob' : '.rotating-years'
    );

    Object.entries(PAGE_INFO).forEach(([key, project], index) => {
        const isFirst = index === 0;
        const span = document.createElement('span');
        span.className = isFirst ? '' : 'translate-y-[100%] opacity-0';
        span.style.gridArea = '1/1/2/2';
        span.textContent = project.year;
        container.appendChild(span);
    });
}

window.addEventListener('load', () => {
    loadImagesMap();
    loadProjectNum();
    loadProjectImages();
    loadProjectRole();
    loadProjectServices();
    loadProjectName();
    loadProjectDesc();
    loadProjectYear();

    const header = document.getElementById('main-nav'); // adjust selector if needed
    const dragArea = document.getElementById('drag-area');

    if (header && dragArea) {
        const headerHeight = header.offsetHeight;
        dragArea.style.height = `calc(100dvh - ${headerHeight + 50}px)`;
    }

    document.dispatchEvent(new Event('htmlInserted'));
});
