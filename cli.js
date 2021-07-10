#!/usr/bin/env node
const {program} = require('commander');
const api = require('./index.js');
const pkg = require('./package.json');
// const program = new Command();

/**
 * Todo-list 功能：
 * 1。 node cli add：添加任务
 * 2。 node cli clear： 清除任务列表
 * 3。 直接运行 node cli：展示所有任务
 */

program.version(pkg.version);

program
  .command('add <taskName>')
  .description('add a task')
  .action((taskName) => {
    api.add(taskName).then(() => {
      console.log('Add successfully!');
    }).catch(e => {
      console.log('Add failed!');
    });
  });

program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear().then(() => {
      console.log('Clear successfully!');
    }).catch(e => {
      console.log('Clear failed!');
    });
  });

program
  .command('show')
  .description('show all tasks')
  .action(() => {
    void api.showAll();
  });

program.parse(process.argv);


