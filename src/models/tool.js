/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import Joi from 'joi'
import Mongoose from 'mongoose'

const toolSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  link: {
    type: String,
    required: false,
    trim: true,
    minlength: 5,
    maxlength: 255,
    default: ''
  },
  tags: {
    type: [String],
    required: false,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
},{ virtuals: true })

toolSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform (doc, ret){   delete ret._id  }
});

// create model by mongoose
const ToolModel = Mongoose.model('Tool', toolSchema)

// Validation parameters
const JoiSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  description: Joi.string().min(5).max(255).required(),
  link: Joi.string().min(5).max(255),
  tags: Joi.array().items(Joi.string().min(3).max(10)),
})

// validation using Joi & finally return the result of validation
export const validateTool = (tool) => JoiSchema.validate(tool)

export default ToolModel