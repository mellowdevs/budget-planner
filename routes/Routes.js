const express = require("express")
const router = express.Router();
const fs = require('fs');
const { randomUUID } = require("crypto");            

const dataPath = './data/data.json' 

const saveData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}
const getData = () => {
      let jsonData = fs.readFileSync(dataPath)  
    try {
      return JSON.parse(jsonData)
    } catch(err) { 
      jsonData = {categories:{}, totalBudget:0, currentBudget:0}
      saveData(jsonData)
      return JSON.parse(jsonData)   
    }
}

const recalculateCategoryAmounts = (category) => {
  let currentBudget = 0;
  Object.values(category.entries).forEach(entry=> {
    currentBudget += entry.amount;
  })
  category.currentBudget = currentBudget;
}

const recalculateAmounts = (data) => {
  let currentBudget = 0;
  let totalBudget = 0;
  Object.values(data.categories).forEach(cat=> {
    currentBudget += cat.currentBudget;
    totalBudget += cat.totalBudget;
  })
  data.currentBudget = currentBudget;
  data.totalBudget  = totalBudget;
}

dataRoutes.get('/', (req, res) => {
  const existingData = getData();
  res.send(JSON.stringify(existingData, null, 2));
})

dataRoutes.post('/', (req, res) => {
  const newCategory = {id: randomUUID(), ...req.body};
  const existingData = getData();
  existingData.categories[newCategory.id] = newCategory;
  recalculateAmounts(existingData);
  saveData(existingData);
  res.send(existingData)
})

dataRoutes.post('/entry/:categoryId', (req, res) => {
  const categoryId = req.params['categoryId'];
  const entry = {id: randomUUID(), ...req.body};
  const existingData = getData();
  const category = existingData.categories[categoryId];
  if(!category) {
    res.send({success:false, msg:'Category not found'})
    return;
  }
  
  category.entries[entry.id] = entry;
  recalculateCategoryAmounts(category);
  existingData.categories[categoryId] = category;
  recalculateAmounts(existingData);
  saveData(existingData);
  res.send(existingData)
})

dataRoutes.put('/:categoryId', (req, res) => {
  const existingData = getData();
  const categoryId = req.params['categoryId'];
  const category =  existingData.categories[categoryId];
  if(!category) {
    res.send({success:false, msg:'Category not found'})
    return;
  }
  const updateCategory = {...category, ...req.body};

  existingData.categories[categoryId] = updateCategory;
  recalculateAmounts(existingData);
  saveData(existingData);
  res.send(existingData)
})


dataRoutes.put('/entry/:entryId', (req, res) => {
  const existingData = getData();
  const entryId = req.params['entryId'];
  const category =  Object.values(existingData.categories).find(cat => Object.keys(cat.entries).includes(entryId) );
  
  if(!category) {
    res.send({success:false, msg:'Entry not found'})
    return;
  }
  const entry = existingData.categories[category.id]?.entries[entryId];
  if(!entry) {
    res.send({success:false, msg:'Entry not found'})
    return;
  }

  const updateEntry = {...entry, ...req.body};
  existingData.categories[category.id].entries[entryId] = updateEntry;
  recalculateCategoryAmounts(existingData.categories[category.id]);
  recalculateAmounts(existingData);
  saveData(existingData);
  res.send(existingData)
})

dataRoutes.delete('/:categoryId', (req, res) => {
  const existingData = getData();
  const categoryId = req.params['categoryId'];
  const category =  existingData.categories[categoryId];
  if(!category) {
    res.send({success:false, msg:'Category not found'})
    return;
  }
  delete existingData.categories[categoryId]
  recalculateAmounts(existingData);
  saveData(existingData);
  res.send(existingData)
})

dataRoutes.delete('/entry/:entryId', (req, res) => {
  const existingData = getData();
  const entryId = req.params['entryId'];
  const category =  Object.values(existingData.categories).find(cat => Object.keys(cat.entries).includes(entryId) );
  if(!category) {
    res.send({success:false, msg:'Entry not found'})
    return;
  }
  const entry = existingData.categories[category.id]?.entries[entryId];
  if(!entry) {
    res.send({success:false, msg:'Entry not found'})
    return;
  }
  delete existingData.categories[category.id].entries[entryId]
  recalculateCategoryAmounts(existingData.categories[category.id])
  recalculateAmounts(existingData)
  saveData(existingData);
  res.send(existingData)
})


module.exports = dataRoutes

module.exports = router;