import React from 'react';
//@ts-ignore
export const CreateTicketForm = ({ onSubmit }) => {
  return (
    <form id='addTicketForm' onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="title">title</label>
        <input type="text" className="form-control" id="title" />
      </div>

      <div className="form-group">
        <label htmlFor="content">content</label>
        <textarea id="content" />
      </div>

      <div className="form-group">
        <label htmlFor="email" required>Email address</label>
        <input
          type="email" //email
          className="form-control"
          id="email"
          placeholder="name@example.com"
        />

        <div className="form-group">
          <label htmlFor="labels">labels</label>
          <input type="text"  id="labels" placeholder="insert labels separate by commas"/>
        </div>
      </div>
      
      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};
export default CreateTicketForm;
