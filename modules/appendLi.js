export default function appendLi(arr, selector) {
    for (let i = 0; i < arr.length; i++) {
        const li = document.createElement('li');
        li.classList.add('list-item', 'default');
        li.setAttribute('data-song', i);
        li.textContent = arr[i].title + ' — ' + arr[i].song;
        selector.appendChild(li);
    }
}