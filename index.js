const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const saveTask = (title, description) =>
    db.collection("tasks").doc().set({
        title,
        description,
    });

// esto es para que me tariga de la base de datos todo lo almacenado en la collection task
const getTask = () => db.collection("tasks").get();

taskForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const title = taskForm["task-title"];
    const description = taskForm["task-description"];
    // esto me va a devolver una respuesta

    await saveTask(title.value, description.value);
    taskForm.reset();
    title.focus();
});