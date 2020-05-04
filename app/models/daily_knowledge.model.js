const mongoose = require('mongoose');
 
//creates a UserSchema for mongoDB using mongoose
const DailyKnowledgeSchema = mongoose.Schema({
	//for login purposes
    id: {
        type: Number,
        unique: true,
        required: true,
        trim: true
      },
      content: {
        type: String,
        required: true,
      },
    
});
 
//make it global
var DailyKnowledgeSchema = mongoose.model('User', DailyKnowledgeSchema);
module.exports = DailyKnowledgeSchema;