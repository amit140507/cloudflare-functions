import { createPagesFunction } from '@cloudflare/pages-functions';
import { D1_DATABASE } from './d1-binding'; // D1 binding reference

export const onRequestPost = async (context) => {
  const formData = await context.request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  try {
    // Insert form data into D1
    await saveToD1(name, email, message);
    return new Response("Form submitted successfully!", { status: 200 });
  } catch (error) {
    return new Response("Error submitting form: " + error.message, { status: 500 });
  }
};

// Function to save form data into D1
async function saveToD1(name, email, message) {
  // Example D1 query to insert data into the `contacts` table
  const query = `
    INSERT INTO contacts (name, email, message)
    VALUES (?, ?, ?)
  `;
  
  // Prepare and execute the query with values
  await D1_DATABASE.prepare(query).bind(name, email, message).run();
}
