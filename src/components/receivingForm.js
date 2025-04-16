import React, { useState } from 'react'

const ReceivingForm = ({ onCancel, onSubmit }) => {
  const [filePreview, setFilePreview] = useState(null)
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    image: '',
    location_specific: '',
    urgency: 'Medium',
    contact_number: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPost({ ...newPost, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(newPost)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewPost((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = () => setFilePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '20px',
        margin: '20px 0',
        backgroundColor: 'white',
        width: '90%',
      }}
    >
      <h2>New Receiving Post</h2>
      <form name='receivingForm' onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Title*</label>
          <input
            type='text'
            name='title'
            value={newPost.title}
            onChange={handleInputChange}
            required
            style={{
              width: '90%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description*</label>
          <textarea
            name='description'
            value={newPost.description}
            onChange={handleInputChange}
            required
            style={{
              width: '90%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              minHeight: '100px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Upload Image</label>
          <div
            style={{
              border: '2px dashed #ddd',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <input
              type='file'
              name='image'
              accept='image/*'
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id='file-input'
            />
            <label htmlFor='file-input' style={{ cursor: 'pointer' }}>
              {filePreview ? (
                <div>
                  <img
                    src={filePreview}
                    alt='Preview'
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                  />
                  <p>{newPost.image.name}</p>
                </div>
              ) : (
                <div style={{ color: '#666' }}>
                  Click to upload image
                  <br />
                  (or drag and drop)
                </div>
              )}
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Specific Location*</label>
          <input
            type='text'
            name='location_specific'
            value={newPost.location_specific}
            onChange={handleInputChange}
            required
            style={{
              width: '90%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contact Number*</label>
          <input
            type='text'
            name='contact_number'
            value={newPost.contact_number}
            onChange={handleInputChange}
            required
            style={{
              width: '90%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Urgency*</label>
          <select
            name='urgency'
            value={newPost.urgency}
            onChange={handleInputChange}
            style={{
              width: '90%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          >
            <option value='Low'>Low</option>
            <option value='Medium'>Medium</option>
            <option value='High'>High</option>
            <option value='Very High'>Very High</option>
            <option value='Severe'>Severe</option>
          </select>
        </div>

        <button
          type='submit'
          style={{
            backgroundColor: '#6200ea',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: '600',
            margin: '5px',
          }}
        >
          Submit
        </button>
        <button
          type='button'
          onClick={onCancel}
          style={{
            backgroundColor: '#f5f5f5',
            color: '#333',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: '600',
            margin: '5px',
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  )
}

export default ReceivingForm
