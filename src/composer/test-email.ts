import { EmailOption } from "./email-input";

export function generateEmailArray(count: number): EmailOption[] {
    const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
  
    const emailArray: EmailOption[] = [];
    const usedEmails = new Set<string>();
  
    while (emailArray.length < count) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
  
      let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
      let attempts = 0;
  
      // If email is already used, add a number to make it unique
      while (usedEmails.has(email) && attempts < 100) {
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${attempts + 1}@${domain}`;
        attempts++;
      }
  
      // If we couldn't generate a unique email after 100 attempts, skip this iteration
      if (attempts === 100) continue;
  
      usedEmails.add(email);
  
      const emailObject: EmailOption = { email };
  
      // Randomly decide whether to include name
      if (Math.random() > 0.3) {
        emailObject.name = `${firstName} ${lastName}`;
      }
  
      emailObject.photo = `https://picsum.photos/200/200?random=${emailArray.length}`;
  
      emailArray.push(emailObject);
    }
  
    return emailArray;
  }
  

// Generate 100 email objects
const emails = generateEmailArray(100);

console.log(emails);