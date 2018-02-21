var addButton = document.getElementById('add');  
//кнопка добавить, обращаемся к элементу по айди в документе
var inputTask = document.getElementById('new-task');
var unfinishedTasks = document.getElementById('unfinished-tasks');
var finishedTasks = document.getElementById('finished-tasks');

function createNewElement(task, finished){ // create elements of li
	var listItem = document.createElement('li');
	var checkbox = document.createElement('button');
	//checkbox have class nizhe

	if(finished){ //работа чекбокса нажат
		checkbox.className = 'material-icons checkbox';  //checkbox have class
		checkbox.innerHTML = '<i class="material-icons">check_box</i>';  //inner html clear in tag

	}else{ //чекбокс не нажат
		checkbox.className = 'material-icons checkbox';  //checkbox have class
		checkbox.innerHTML = '<i class="material-icons">check_box_outline_blank</i>';  //inner html clear in tag

}

	
	var label = document.createElement('label');
	label.innerText = task;
	var input = document.createElement('input'); //pole vvoda
	input.type = "text";

	var editButton = document.createElement('button');//edit button
	editButton.className = 'material-icons edit';
	editButton.innerHTML = '<i class="material-icons">edit</i>';

	var deleteButton = document.createElement('button');
	deleteButton.className = 'material-icons delete';
	deleteButton.innerHTML = '<i class="material-icons">delete</i>';

	listItem.appendChild(checkbox);//appendchild dobavlyaet
	listItem.appendChild(label);
	listItem.appendChild(input);
	listItem.appendChild(deleteButton);
	listItem.appendChild(editButton);

	return listItem;

}

function addTask(){  //metod - code srabativaet pri button click
	if (inputTask.value){
		var listItem = createNewElement(inputTask.value, false);
		unfinishedTasks.appendChild(listItem);
		bindTaskEvents(listItem, finishTask);
		inputTask.value = '';


	}
	save();
}

addButton.onclick = addTask; //prikreplyaem etet metod addtask k knopke

function deleteTask(){
	var listItem = this.parentNode;//элемент списка = будет обращаться к родителю этого элемента мписка
	var ul = listItem.parentNode;
	ul.removeChild(listItem); //удаляем элемент списка

	save();
}


function editTask(){

	var editButton = this;
	var listItem = this.parentNode;
	var label = listItem.querySelector('label');
	var input=listItem.querySelector("input[type=text]");

	var containsClass = listItem.classList.contains('editMode');

	if(containsClass) {
		label.innerText = input.value; //свойство иннер текст задаем значение внутри лейбл
		editButton.className = "material-icons edit";
		editButton.innerHTML = '<i class = "material-icons">edit</i>';
	save();
	}else{
		input.value=label.innerText;
		//в иннер передаем текст который был написан до этого
		editButton.className = "material-icons save";
		editButton.innerHTML = '<i class = "material-icons">save</i>';
	}
	listItem.classList.toggle("editMode"); 
	//переключает класс(появляться/исчезать) при нажатии кнопку редактровать
}

function finishTask(){
	var listItem = this.parentNode;
	var checkbox = listItem.querySelector('button.checkbox');
	checkbox.className = 'material-icons checkbox';
	checkbox.innerHTML = "<i class = 'material-icons'>check_box</i>";
	//через иннер хтмл задаем иконку с галочкой

	finishedTasks.appendChild(listItem); //переместить лист итем в блок завершенных
	bindTaskEvents(listItem, unFinishTask); //задаем ему другой метод анфинштаск чтоб потом вышел из этого блока
	save();

}

function unFinishTask(){
	var listItem = this.parentNode;
	var checkbox = listItem.querySelector('button.checkbox');
	checkbox.className = "material-icons checkbox";
	checkbox.innerHTML = "<i class = 'material-icons' >check_box_outline_blank</i>";//иконка без галочки

	unfinishedTasks.appendChild(listItem);
	bindTaskEvents(listItem, finishTask);
	save();
}

function bindTaskEvents(listItem, checkboxEvent){ //привязка верхних методов к элементу во время создания

	var checkbox = listItem.querySelector('button.checkbox');
	var editButton = listItem.querySelector('button.edit');
	var deleteButton = listItem.querySelector('button.delete');

	checkbox.onclick = checkboxEvent;
	editButton.onclick = editTask;
	deleteButton.onclick = deleteTask;


}

function save(){ 
//у объекта 2 свойства, в объекте хранятся массивы, массив преобразуем в джейсон строку, эта строка хранится в локал стораж. а из этой строки получаем обратно объект
	var unfinishedTasksArr = [];
	for (var i = 0; i < unfinishedTasks.children.length; i++) {
		//ли - чидрен от юл
		unfinishedTasksArr.push(unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText);
		
	}

	var finishedTasksArr = [];
	for (var i = 0; i < finishedTasks.children.length; i++) {
		finishedTasksArr.push(finishedTasks.children[i].getElementsByTagName('label')[0].innerText);
	}
	console.log(finishedTasksArr);


	localStorage.removeItem('todo');
	localStorage.setItem('todo', JSON.stringify({	
		unfinishedTasks: unfinishedTasksArr,
		finishedTasks: finishedTasksArr
		}) );

}

function load(){
	return JSON.parse(localStorage.getItem('todo'));
}

var data = load();
for(var i = 0; i < data.unfinishedTasks.length; i++){
	var listItem = createNewElement(data.unfinishedTasks[i], false);
	unfinishedTasks.appendChild(listItem);
	bindTaskEvents(listItem,finishTask);//назначаем обработчики
}
for( var i = 0; i < data.finishedTasks.length; i++){
	var listItem = createNewElement(data.finishedTasks[i], true);
	finishedTasks.appendChild(listItem);
	bindTaskEvents(listItem,unFinishTask);
}