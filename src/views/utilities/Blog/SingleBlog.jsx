import React, { useEffect, useState } from 'react'
import { Tag } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const SingleBlog = () => {

    const id = useParams().id
   const [blog,SetBlogs] = useState()

    const getBlogbyid=async()=>{
        try {
            
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/blog/blogs/${id}/`)
            if (response.status=== 200 ) {
                SetBlogs(response.data.data.blog_details)
            }
        } catch (error) {
            console.log(error);
            
        }
    }
useEffect(()=>{
    getBlogbyid()
},[])

      return (
   <>
     <div className="flex flex-col items-center   ">
      <div className="flex flex-col md:flex-row w-full mt-4">
        <div className="w-full md:w-2/3 m-4">
                  <div
                    //  key={index}
                     className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:-translate-y-2"
                   >
                     <div className="relative">
                       <img name=" "   
                         src={`${process.env.REACT_APP_API_URL}${blog?.image}`}
                         alt={blog?.title}
                         loading="lazy"
                         className="w-full h-64 object-cover"
                       />
                       <div className="absolute top-4 right-4">
                         <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                           <Tag size={14} />
                           {blog?.category}
                         </span>
                       </div>
                     </div>
         
                     <div className="p-6">
                       <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                         <div className="flex items-center gap-1">
                           {/* <Calendar size={16} />
                           {post.date} */}
                         </div>
                         <div className="flex items-center gap-1">
                           {/* <Clock size={16} />
                           {post.readTime} */}
                         </div>
                       </div>
         
                       <h3 className="text-xl font-semibold text-gray-800 mb-3 ">
                         {blog?.title}
                       </h3>
         
                       <p className="text-gray-600 mb-4 ">
                         {blog?.content}
                       </p>
         
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           {/* <User size={18} className="text-gray-500" /> */}
                           <span className="text-sm text-gray-600">
                            {/* {post.author} */}
                            </span>
                         </div>
         
                         {/* <Link
                           to="single"
                           className="inline-flex items-center gap-2 text-[#2F4333] font-medium hover:gap-3 transition-all duration-300"
                         >
                           Read More
                           <ArrowRight size={18} />
                         </Link> */}
                       </div>
                     </div>
                   </div>
        </div>
        <div className="w-full md:w-1/4 m-4">
          <CategoryFilter />
        </div>
      </div>

    </div>
   </>
  )
}

export default SingleBlog