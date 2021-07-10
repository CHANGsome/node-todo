const db = require('./db');
const inquirer = require('inquirer');


module.exports.add = async (taskName) => {
  // 读取之前的file
  const list = await db.read();
  // 往里面添加一个任务
  list.push({taskName, done: false});
  // 存储任务列表
  await db.write(list);
}

module.exports.clear = async () => {
  await db.write([]);
}

const maskAsDone = async (list, index) => {
  list[index].done = true;
  await db.write(list);
}

const cancelDone = async (list, index) => {
  list[index].done = false;
  await db.write(list);
}

const updateTaskName = async (list, index) => {
  inquirer.prompt({
    type: 'input',
    name: 'taskName',
    message: '新的任务名',
    default: list[index].title
  }).then(taskNameAnswer => {
    list[index].taskName = taskNameAnswer.taskName;
    db.write(list);
  })
}

const remove = async (list, index) => {
  list.splice(index, 1);
  await db.write(list);
}

const askForAction = (list, index) => {
  const actions = {maskAsDone, cancelDone, updateTaskName, remove};
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: '请选择操作',
      choices: [
        {name: '退出', value: 'quit'},
        {name: '已完成', value: 'maskAsDone'},
        {name: '未完成', value: 'cancelDone'},
        {name: '改任务名', value: 'updateTaskName'},
        {name: '删除任务', value: 'remove'},
      ],
    }).then(async (operatingAnswer) => {
    const action = actions[operatingAnswer.action];
    action && action(list, index);
  })
}

const askForCreateTask = (list) => {
  inquirer.prompt({
    type: 'input',
    name: 'taskName',
    message: '输入任务名称'
  }).then(async (taskNameAnswer) => {
    list.push({taskName: taskNameAnswer.taskName, done: false});
    await db.write(list);
  })
}

const printTasks = (list) => {
  const choices = [{name: '退出', value: '-1'}].concat(list.map((item, index) => {
    return {
      name: `[${item.done ? 'x' : '_'}] ${index + 1} ${item.taskName}`,
      value: index.toString()
    };
  }));
  choices.push({name: '+ Add a task', value: '-2'});

  // print tasks
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: '请选择要操作的任务',
      choices: choices,
    })
    .then(taskAnswer => {
      const index = +taskAnswer.index;
      if (index >= 0) {
        // 选中一个任务
        askForAction(list, index);
      } else if (+taskAnswer.index === -2) {
        // 创建一个任务
        askForCreateTask(list);
      }
    });
}

module.exports.showAll = async () => {
  const list = await db.read();
  printTasks(list);
}
