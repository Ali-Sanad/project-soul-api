module.exports.contactUs = (name, messege, email, phone) => {
  return `
  <div
  style="padding:30px 0 ;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;text-align: center; background-color:#051c22; color:#080808; border-radius: 5px;">
  <p style="font-size:1.3rem; font-weight:bold">
      Welcome to <span
          style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; color: rgb(120, 199, 166); font-size:x-large;">Soul</span>
  </p>
  <hr style="width:50%; color: black;" />
  <h4 style="text-align: left; padding-left: 50px; margin-bottom: 2rem;color: white;">Hello ${name}, we will be
      in touch as soon as possible !!</h4>
  <div style="font-size: 1rem; color: white; padding-left: 50px; padding-bottom:20px; text-align: left;">
      <p>Messege: ${messege} </p>
      <p>Messege from: <b><i>${email}</i></b> <br>
      </p>
      <p>Phone number: ${phone} </p>
  </div>

</div>
      `;
};
