const utilService = new (require('../libs/util.service'))();

class Task {
    static get tableName() {
        return 'tasks';
    }

    createTask(taskDetails, user) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!(taskDetails && taskDetails.name)) {
                    return reject({ status: 400, message: 'Invalid task details' });
                }
                const id = utilService.gendrateUUID();
                const query = utilService.createPostQuery({
                    id,
                    created_by: user.id,
                    parent_id: taskDetails.parent_id,
                    name: taskDetails.name,
                    desc: taskDetails.desc,
                    created_at: taskDetails.created_at
                }, Task.tableName);
                await global.connection.execute(query, []);
                return resolve({
                    message: 'Task created successfully!',
                    id
                });
            }
            catch (err) {
                console.log(err);
                return reject({ status: 500, message: 'Something went wrong!' });
            }
        });
    }

    getTask(user, taskId = undefined) {
        return new Promise(async (resolve, reject) => {
            try {
                let conditions = { created_by: user.id };
                if (taskId) {
                    conditions.id = taskId;
                }
                const sqlOperation = utilService.createGetQuery('all', conditions, Task.tableName);
                const result = await global.connection.execute(sqlOperation.query, sqlOperation.values);
                return resolve({
                    message: 'Task list!',
                    tasks: result
                });
            }
            catch (err) {
                console.log(err);
                return reject({ status: 500, message: 'Something went wrong!' });
            }
        })
    }
}

module.exports = Task;