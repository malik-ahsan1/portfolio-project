const PROJECTS_TIMELINE_DATA = {
    1: {
        title: 'BitMEX',
        role: 'Head of Design & <br> Brand',
        employmentType: 'Full-time',
        location: 'Singapore',
        startDate: 'May, 2026',
        endDate: 'Present',
    },
    2: {
        title: 'BitMEX',
        role: 'N/A',
        employmentType: 'Full-time',
        location: 'Singapore',
        startDate: 'May, 2026',
        endDate: 'Present',
    },
    3: {
        title: 'BitMEX',
        role: 'Head of Design & <br> Brand',
        employmentType: 'Full-time',
        location: 'Singapore',
        startDate: 'May, 2026',
        endDate: 'Present',
    },
    4: {
        title: 'BitMEX',
        role: 'Head of Design & <br> Brand',
        employmentType: 'Full-time',
        location: 'Singapore',
        startDate: 'May, 2026',
        endDate: 'Present',
    },
    5: {
        title: 'BitMEX',
        role: 'Head of Design & <br> Brand',
        employmentType: 'Full-time',
        location: 'Singapore',
        startDate: 'May, 2026',
        endDate: 'Present',
    },
    6: {
        title: 'BitMEX',
        role: 'Head of Design & <br> Brand',
        employmentType: 'Full-time',
        location: 'Singapore',
        startDate: 'May, 2026',
        endDate: 'Present',
    },
    7: {
        title: 'BitMEX',
        role: 'Head of Design & <br> Brand',
        employmentType: 'Full-time',
        location: 'Singapore',
        startDate: 'May, 2026',
        endDate: 'Present',
    },
    8: {
        title: 'BitMEX',
        role: 'Head of Design & <br> Brand',
        employmentType: 'Full-time',
        location: 'Singapore',
        startDate: 'May, 2026',
        endDate: 'Present',
    },
    9: {
        title: 'BitMEX',
        role: 'Head of Design & <br> Brand',
        employmentType: 'Full-time',
        location: 'Singapore',
        startDate: 'May, 2026',
        endDate: 'Present',
    },
    10: {
        title: 'BitMEX',
        role: 'Head of Design & <br> Brand',
        employmentType: 'Full-time',
        location: 'Singapore',
        startDate: 'May, 2026',
        endDate: 'Present',
    },
};

window.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.projects-timeline-container');

    if (!container) return;

    Object.values(PROJECTS_TIMELINE_DATA).forEach((project, index) => {
        const isFirst = index === 0;
        const item = document.createElement('div');
        item.className =
            'projects-timeline-item flex items-stretch min-w-[31rem]';

        const verticalRuler = isFirst ? null : document.createElement('div');
        if (verticalRuler) {
            verticalRuler.className = 'vertical-ruler w-[2px] bg-gray-800';
            item.appendChild(verticalRuler);
        }

        const itemData = document.createElement('div');
        itemData.className =
            'item-data mt-5 hover:text-white transition-colors duration-300 w-full flex flex-col justify-between';

        itemData.innerHTML = `
            <div class="main-data ml-28 mr-44">
                <div class="role-employement flex flex-col gap-0">
                    <div class="role">
                        <span class="role-text w-[10rem] whitespace-nowrap">${
                            project.role
                        }</span>
                    </div>
                    <div class="employement-type text-base font-normal">
                        <span class="employment-text">${
                            project.employmentType
                        }</span>
                    </div>
                </div>
                
                <div class="title-location mt-12 flex flex-col gap-0 leading-0">
                    <div class="title">
                        <span class="title-text text-xl">${project.title}</span>
                    </div>
                    <div class="location">
                        <span class="location-text text-base font-normal">${
                            project.location
                        }</span>
                    </div>
                </div>
                
                <div class="date mt-16 mb-12 flex flex-col gap-5">
                    <div class="start-date flex flex-col">
                        <span class="text-base font-normal">From</span>
                        <span class="start-date-text text-xl">${
                            project.startDate
                        }</span>
                    </div>
                    <div class="end-date flex flex-col">
                        <span class="text-base font-normal">To</span>
                        <span class="end-date-text text-xl">${
                            project.endDate
                        }</span>
                    </div>
                </div>
            </div>
            <div class="measurement-lines w-[86%] mx-auto flex justify-between items-end">
                ${Array.from(
                    { length: 13 },
                    (_, i) =>
                        `<div class="w-[2px] h-${
                            i === 6 ? '16' : '5'
                        } bg-gray-800"></div>`
                ).join('')}
            </div>
        `;

        item.appendChild(itemData);
        container.appendChild(item);
    });

    document.dispatchEvent(new Event('ProjectTimelineHtmlInserted'));
});
