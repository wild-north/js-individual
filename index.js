(function() {
    let isAscending = true;
    let lastSortedBy;
    
    window.onload = function() {
        initUi(renderTable);
    };
    
    function initUi(render) {
        const submitRequestButton = document.querySelector('#submit-request');
    
        submitRequestButton.addEventListener('click', () => {
            showModal()
                // .then(() => fetch('./data.json'))
                .then(readableStream => readableStream.json())
                .then(data => render(data))
                .then(() => {
                    var a = 10;
                    var b = 20;
                    
                    console.log(1123123);

                    if (a < b) {
                        return Promise.resolve();
                    } else {
                        return Promise.reject();
                    }
                })
                .then(
                    function success() {
                        console.log('success');
                    },
                    function error() {
                        console.log('error');
                    },
                )
                .then(hideModal, hideModal);
        });
    }

    function showModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'block';

        const promise = new Promise(function (resolve, reject) {
            modal.addEventListener('click', function(ev) {
                if (ev.target.nodeName !== 'BUTTON') {
                    return;
                }
    
                const { action } = ev.target.dataset;
    
                if (action === 'proceed') {
                    resolve();
                } else {
                    reject();
                }
            });
        });

        return promise;
    }
    function hideModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = '';
    }
    
    function renderTable(data) {
        let template = `
        <table>
            <thead>
                <tr class="heading">
                    <th class="name" data-sort-by="name">name</th>
                    <th class="email" data-sort-by="email">email</th>
                    <th class="balance" data-sort-by="balance">balance</th>
                    <th class="company" data-sort-by="company">company</th>
                    <th class="gender" data-sort-by="gender">gender</th>
                    <th class="age" data-sort-by="age">age</th>
                    <th class="eye-color" data-sort-by="eyeColor">eye color</th>
                </tr>
            </thead>`;
        data.forEach(person => {
            template += (
                `
                <tr class="row">
                    <td class="name">${person.name}</td>
                    <td class="email">${person.email}</td>
                    <td class="balance">${person.balance}</td>
                    <td class="company">${person.company}</td>
                    <td class="gender">${person.gender}</td>
                    <td class="age">${person.age}</td>
                    <td class="eyeColor">${person.eyeColor}</td>
                </tr>`
            );
        });
        template += `</table>`;
        
        const content = document.querySelector('.content');
        content.innerHTML = template;
    
        const tableHeading = document.querySelector('.heading');
    
        const handleHeadingClick = event => {
            const { sortBy } = event.target.dataset;
    
            if (lastSortedBy !== sortBy) {
                isAscending = true;
            }
            
            const sortedData = customSort(data, sortBy, isAscending);
    
            lastSortedBy = sortBy;
            isAscending = !isAscending;

            renderTable(sortedData);
        };
    
        tableHeading.addEventListener('click', handleHeadingClick);
    }
    
    function customSort(dataArray, key, isAscending) {
        const array = dataArray.slice();
    
        array.sort((a,b) => {
            if (a[key] > b[key]) {
                return isAscending ? 1 : -1;
            }
            if (a[key] < b[key]) {
                return isAscending ? -1 : 1;
            }
        });

        return array;
    }
})();