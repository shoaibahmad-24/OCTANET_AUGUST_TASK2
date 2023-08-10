const tasksList = document.querySelector('#tasks-list');
const addTaskInput = document.querySelector('#add-task-input');

let list = JSON.parse(localStorage.getItem('tasks')) || [];

function showTasksList() {
	tasksList.innerHTML = '';

	const list = JSON.parse(localStorage.getItem('tasks')).reverse();

	if (list.length > 0) {
		for (const task of list) {
	
			const li = document.createElement('li');
			li.classList.add('ui', 'segment', 'grid', 'equal', 'width');

			const div1 = document.createElement('div');
			div1.classList.add('ui', 'checkbox', 'column');
			const input = document.createElement('input');
			input.type = 'checkbox';
			input.checked = task.completed;
			div1.appendChild(input);
			const label = document.createElement('label');
			label.textContent = task.text;
			div1.appendChild(label);
			li.appendChild(div1);

			const div2 = document.createElement('div');
			div2.classList.add('column');

			const edit = document.createElement('i');
			edit.classList.add('edit', 'outline', 'icon');
			edit.setAttribute('onclick', `showEditModal(${task.id})`);
			div2.appendChild(edit);

			const remove = document.createElement('i');
			remove.classList.add(
				'trash',
				'alternate',
				'outline',
				'remove',
				'icon'
			);
			remove.setAttribute('onclick', `showRemoveModal(${task.id})`);
			div2.appendChild(remove);
			li.appendChild(div2);

			return tasksList.appendChild(li);
		}
	}

	const message = document.createElement('div');
	message.classList.add('ui', 'icon', 'warning', 'message');
	const icon = document.createElement('i');
	icon.classList.add('inbox', 'icon');
	message.appendChild(icon);
	const content = document.createElement('div');
	content.classList.add('content');
	const header = document.createElement('div');
	header.classList.add('header');
	header.textContent = 'You have nothing task today!';
	content.appendChild(header);
	content.append('Enter your tasks today above.');
	message.appendChild(content);
	tasksList.style.border = 'none';
	tasksList.appendChild(message);
}

function addTask(event) {
	if (tasksList.style.border == 'none') {
		tasksList.style.border = '1px solid rgba(34,36,38,.15)';
	}

	if (event.keyCode == 13) {
		list.push({
			id: list.length + 1,
			text: event.target.value,
			completed: false
		});

		localStorage.setItem('tasks', JSON.stringify(list));

		new Noty({
			text: '<i class="check icon"></i> Task was successfully added.',
			layout: 'bottomRight',
			timeout: 2000,
			progressBar: true,
			closeWith: ['click'],
			theme: 'metroui'
		}).show();

		event.target.value = '';
		showTasksList();
	}
}

function completeTask(id) {
	
	const taskIndex = list.findIndex(t => t.id == id);
	const task = list[taskIndex];

	task.completed = !task.completed;
	list[taskIndex] = task;

	localStorage.setItem('tasks', JSON.stringify(list));
	showTasksList();
}

function removeTask(id) {
	list = list.filter(t => t.id !== id);
	localStorage.setItem('tasks', JSON.stringify(list));

	new Noty({
		text: '<i class="trash icon"></i> Task was successfully deleted.',
		type: 'error',
		layout: 'bottomRight',
		timeout: 2000,
		progressBar: true,
		closeWith: ['click'],
		theme: 'metroui'
	}).show();
	showTasksList();
}

function editTask(id) {
	const taskText = document.querySelector('#task-text').value;

	if (taskText == '' || taskText == null) return;
	const taskIndex = list.findIndex(t => t.id == id);

	list[taskIndex].text = taskText;
	localStorage.setItem('tasks', JSON.stringify(list));

	new Noty({
		text: '<i class="edit icon"></i> Task was successfully updated.',
		layout: 'bottomRight',
		timeout: 2000,
		progressBar: true,
		closeWith: ['click'],
		theme: 'metroui'
	}).show();
	showTasksList();
}

function clearAllTasks() {
	if (list.length > 0) {
		list = [];
		localStorage.setItem('tasks', JSON.stringify(list));
		return showTasksList();
	}

	new Noty({
		type: 'error',
		text: '<i class="close icon"></i> There is no task to remove.',
		layout: 'bottomRight',
		timeout: 2000,
		progressBar: true,
		closeWith: ['click'],
		theme: 'metroui'
	}).show();
}

function clearCompleteTasks() {
	if (list.length > 0) {
		if (confirm('Are you sure?')) {
			const filteredTasks = list.filter(t => t.completed !== true);
			localStorage.setItem('tasks', JSON.stringify(filteredTasks));
			return showTasksList();
		}
	}

	Toastify({
		text: 'There is no task to remove',
		duration: 3000,
		close: true,
		gravity: 'bottom',
		position: 'left',
		backgroundColor: 'linear-gradient(to right, #e45757, #d44747)',
		stopOnFocus: true
	}).showToast();
}

function showEditModal(id) {
	const taskIndex = list.findIndex(t => t.id == id);
	const { text } = list[taskIndex];

	document.querySelector('#edit-modal .content #task-id').value = id;
	document.querySelector('#edit-modal .content #task-text').value = text;
	document
		.querySelector('#update-button')
		.setAttribute('onclick', `editTask(${id})`);

	$('#edit-modal.modal').modal('show');
}
function showRemoveModal(id) {
	document
		.querySelector('#remove-button')
		.setAttribute('onclick', `removeTask(${id})`);

	$('#remove-modal.modal').modal('show');
}

function showClearAllTasksModal() {
	if (list.length > 0) {
		return $('#clear-all-tasks-modal.modal').modal('show');
	}

	new Noty({
		type: 'error',
		text: '<i class="close icon"></i> There is no task to remove.',
		layout: 'bottomRight',
		timeout: 2000,
		progressBar: true,
		closeWith: ['click'],
		theme: 'metroui'
	}).show();
}

addTaskInput.addEventListener('keypress', addTask);
window.addEventListener('load', () => addTaskInput.focus());

showTasksList();