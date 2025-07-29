import Student from "../models/students.js"

 
 export  function createStudent(req,res){

        if(req.user == null){
            res.status(404).json(
                {
                    message : "please log in as a student"
                }
            )
            return
        }

        if(req.user.role != "admin"){
            res.status(403).json(
                {
                    message : "please log in as a admin"
                }
            )
            return
        }

        console.log(req.user)

        
        
        console.log(req.body)
        res.json( 
            {
                message : "This is student router response message."
        
                
            }
        )

        console.log("This is student router message..")

        const student = new Student(
          {
            name : req.body.name,
            age : req.body.age,
            email : req.body.email
          }
      )
      student.save().then(
        {
            message : "Student record saved sucessfully."
        }

      ).catch(
        {
            message : "Student record saved uncessfully."
        }
      )

    }

  export function displayStudent(req,res){
        Student.find().then(
            
            (students)=>{
               
                res.json(students)
                console.log(students)
            }
        ).catch(
            ()=>{
                message : "faild to fetch data"
            }
        )

    }

       /*  export async function displayStudent(req,res){

        try{
            const students = await Student.find()
            res.json(students);

        }catch(error){
            res.status(500).json(
                {
                    message : "Faild to fetch students",
                   error : error.message
                    
                }
            )


        };


     }   */




    