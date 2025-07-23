import Course from "../models/cources.js"

export function addCource(req,res){

    console.log(req.body)

    const cource = new Course(
        {
            courseName : req.body.courseName,
            courseID : req.body.courseID,
            courseDuration : req.body.courseDuration,
            coursefee : req.body.coursefee,
        }
    )

    cource.save().then(
        {
            message : "Cource record saved sucessfully.."
        }
    ).catch(
        {
            message : "cource record saved unsucessfully.."
        }
    )
 

}

export function displayCource(req,res){

    
   
    Course.find().then(

        
        
            (cources)=>{
                console.log(student)
                res.json(cources)
            }
        
    ).catch(
        ()=>{
            message : "faild to display cource details"
        }
    )

}