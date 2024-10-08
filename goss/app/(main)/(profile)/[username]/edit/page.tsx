import React from 'react'


export default function page() {

  

  return (
    <form className='  w-full h-lvh mx-auto p-3'>

      {/* <button 
      className='mr-1 p-2 font-bold'
      onClick={cancel}
      >X</button> */}
      <h2 className='text-xl font-bold mb-3 inline-block'>Edit profile</h2>

      <label
        htmlFor="profile_img"
        className='block mb-1'
      >
        Profile image
      </label>
      <input
        id="profile_img"
        name="profile_img"
        type="file"
        className="mt-1 block w-full rounded-md border  border-gray-300 px-3 py-2 text-black shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
      />

      <label htmlFor="displayname" className='block mb-1' >Name</label>
      <input
        id="displayname"
        type='text'
         placeholder="Name"
        className=" w-full p-2 border border-gray-300 rounded shadow-sm"
      />

      <label htmlFor="displayname" className='block mb-1 '>Bio</label>

      <textarea
        id="displayname"
         placeholder="Bio"
        className=" w-full p-2 border border-gray-300 rounded shadow-sm"
        rows={4}
      ></textarea>





    </form>
  )
}
