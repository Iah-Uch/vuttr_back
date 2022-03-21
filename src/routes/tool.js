/* eslint-disable prefer-arrow-callback */
import express from 'express'
import Mongoose from 'mongoose'
import Tool, { validateTool } from '../models/tool'

const router = express.Router()

// Lists all created tools
router.get('/', async (_req, res) => {
  // Querying all tools available
  const tools = await Tool.find()

  return res.status(200).json({
    data: tools,
    success: true,
    message: 'Successfully retrieved!',
  })
})

// Adds a new tool.
router.post('/add', async (req, res) => {
    // Validates the arriving request.
  const { error } = validateTool(req.body)

  if (error) {
    return res.status(400).json({
      data: [],
      success: false,
      message: error?.details[0]?.message,
    })
  }
  // Creates a new tool
  let tool = new Tool({
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    tags: req.body.tags
  })

  tool = await tool.save()

  return res.status(201).json({
    data: tool,
    success: true,
    message: 'Successfully Added!',
  })
})

// Returns the data of a single tool by id.
router.get('/:id', async (req, res) => {
    // Checking if the provided id is valid.
  if (!Mongoose.Types.ObjectId.isValid(req.query.id))
    return res.status(400).json({
      data: [],
      success: false,
      message: 'Invalid id!'
    })

  // Querying id In mongodb with mongoose.
  const tool = await Tool.findById(req.query.id)

  // Checking if the requested tool is in the database.
  if (!tool)
    return res.status(404).json(
      res.json({
        data: [],
        success: false,
        message: 'Tool not found!'
      })
    )

  // If found then send the response.
  return res.status(200).json({
    data: tool,
    success: true,
    message: 'Successfully retrieved!'
  })
})

// Updates an existing tool by id.
router.put('/:id', async (req, res) => {
  // Validates the arriving request.
  const { error } = validateTool(req.body)

  if (error) {
    return res.status(400).json({
      data: [],
      success: false,
      message: error?.details[0]?.message,
    })
  }

  // Finds the corresponding tool and updates it with mongoose.
  const tool = await Tool.findByIdAndUpdate(
    req.query.id,
    {title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    tags: req.body.tags },
    {
      new: true,
    }
  )

  // If the process is successful, returns the updated tool. Else, returns the error.
  if (!tool)
    return res.status(404).json({
      success: false,
      message: 'Tool not found!',
    })

  return res.status(200).json({
    data: tool,
    success: true,
    message: 'Successfully Updated!'
  })
})

// Deletes a tool by id.
router.delete('/:id', async (req, res) => {
  // Finds the corresponding tool and deletes it with mongoose and MongoDB.
  const deletedTool = await Tool.findByIdAndRemove(req.query.id)

  // If the process is successful, returns the deleted tool. Else, returns the error.
  if (!deletedTool)
    return res.status(404).json({
      success: false,
      message: 'Tool not Found!',
    })

  return res.status(200).json({
    data: deletedTool,
    success: true,
    message: 'Successfully Deleted!',
  })
})

// Returns the data of a single tool by id.
router.get('/tags/:tags', async (req, res) => {
    // Querying tags In mongodb with mongoose.

    Tool.find({tags: req.params.tags}).then(tools => {
        if(tools[0] !== undefined){
            res.status(200).json({
                data: tools,
                success: true,
                message: 'Successfully retrieved!'
            });
        }else{
            res.status(404).json({
                success: false,
                message: 'Tool not found!'
            });
        }
    });
})




export default router