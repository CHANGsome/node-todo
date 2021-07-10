const home_dir = require('os').homedir();
const home = process.env.HOME || home_dir;
const path = require('path');
const fs = require('fs');

// 存放todo-lists的地址
const db_path = path.join(home, '.todo');

const db = {
  read(path = db_path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (err, data) => {
        if (err) return reject(err);
        let list;
        try {
          list = JSON.parse(data.toString());
        } catch (err2) {
          list = [];
        }
        resolve(list);
      })
    })
  },
  write(list, path=db_path) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(list)+'\n', (err)=>{
        if(err) reject(err);
        resolve();
      })
    })

  }
}

module.exports = db;
