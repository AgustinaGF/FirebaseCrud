const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const taskContainer = document.getElementById("task-container");
let editStatus = false;
let id = "";
// para guardar los datos
const saveTask = (title, description) =>
    db.collection("tasks").doc().set({
        title,
        description,
    });
// ****Funciones de firebase
// funcion para traer los datos almacenados en la collection task
const getTasks = () => db.collection("tasks").get();
// esto para que se actualice los datos de la collection cada vez que ingreso uno nuevo
const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);
// funcion que me va a permitir borrar una task
const deleteTask = (id) => db.collection("tasks").doc(id).delete();
// funcion que me va a devolver la tarea de acuerdo al id
const getTask = (id) => db.collection("tasks").doc(id).get();
// funcion para editar
const updateTask = (id, updateTask) =>
    db.collection("tasks").doc(id).update(updateTask);
// esto para que cuando cargue el dom se ejecute el evento
window.addEventListener("DOMContentLoaded", async(e) => {
    // esto me va a devolver una respuesta
    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const task = doc.data();
            task.id = doc.id;
            taskContainer.innerHTML += `<div class="card card-body mt-2 border primary">
               <h3 class="h5"> ${task.title}</h3>
               <p> ${task.description}</p>
               <div>
               <button class="btn btn-primary btn-delete" data-id="${task.id}">Delete</button>
               <button class="btn btn-secondary btn-edit" data-id="${task.id}">Edit</button>
               </div>
            </div>`;

            const btnsDelete = document.querySelectorAll(".btn-delete");
            btnsDelete.forEach((btn) => {
                btn.addEventListener("click", async(e) => {
                    // con esto paso el id de la tarea que quiero sea eliminada
                    await deleteTask(e.target.dataset.id);
                });
            });
            const btnsEdit = document.querySelectorAll(".btn-edit");
            btnsEdit.forEach((btn) => {
                btn.addEventListener("click", async(e) => {
                    // esto me va a devolver los datos por id
                    const doc = await getTask(e.target.dataset.id);
                    const task = doc.data();
                    // con esto lleno el form con los datos de la task qe quiero editar
                    editStatus = true;
                    id = doc.id;
                    taskForm["task-title"].value = task.title;
                    taskForm["task-description"].value = task.description;
                    taskForm["btn-task-form"].innerText = "Update";
                });
            });
        });
    });
});
taskForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const title = taskForm["task-title"];
    const description = taskForm["task-description"];
    if (!editStatus) {
        await saveTask(title.value, description.value);
    } else {
        // aca es donde voy a pasar los datos actualizados
        await updateTask(id, {
            title: title.value,
            description: description.value,
        });
        editStatus = false;
        id = "";
        taskForm["btn-task-form"].innerText = "Save";
    }
    await getTasks();
    taskForm.reset();
    title.focus();
});