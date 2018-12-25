(function() {
    let isAscending = true;
    let lastSortedBy;
    
    window.onload = function() {
        initUi(renderTable);
    };
    
    function initUi(render) {
        const submitRequestButton = document.querySelector('#submit-request');
    
        submitRequestButton.addEventListener('click', function() {
            showModal()
                .then(() => fetch('./data.json'))
                .then(readableStream => readableStream.json())
                .then(data => render(data))
                .then(hideModal, hideModal);
        });
    }

    function showModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'block';

        const promise = new Promise(function(resolve, reject) {
            modal.addEventListener('click', function(ev) {
                if (ev.target.nodeName !== 'BUTTON') {
                    return;
                }
    
                const { action } = ev.target.dataset;
                //const action = ev.target.dataset.action;
    
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
        console.log(123123123);
        const modal = document.querySelector('.modal');
        modal.style.display = '';
    }

    function initRequest() {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', './data.json');
        xhr.timeout = 30000; // 30 sec
    
        xhr.onloadstart = function() {
            console.log('запрос начат');
        };
        xhr.onprogress = function() {
            console.log('браузер получил очередной пакет данных, можно прочитать текущие полученные данные в responseText');
        };
        xhr.abort = function() {
            console.log('запрос был отменён вызовом xhr.abort()');
        };
        xhr.onerror = function() {
            console.log('произошла ошибка');
        };
        xhr.ontimeout = function() {
            console.warn('запрос был прекращён по таймауту');
        };
        xhr.onloadend = function() {
            console.log('запрос был завершён (успешно или неуспешно)');
        };
    
        return xhr;
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
    
            //tableHeading.removeEventListener('click', handleHeadingClick);
    
            renderTable(sortedData);
        };
    
        tableHeading.addEventListener('click', handleHeadingClick);
        
        /*
            Домашнее задание:
                1 - реализовать сортировку для всех (!) колонок
                2 - сортировка должна работать следующий образом
                    2.1 - каждый первый клик вызывает сортировку
                         в возрастающем порядке (ascending order)
                    2.2 - каждый второй клик вызывает сортировку
                         в убывающем порядке (descending order)
                3 - Реализовать подход делегирования событий, 
                    чтобы не плодить обработчики 
                    событий для каждой колонки (например что, если колонок будет 150).
        */
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