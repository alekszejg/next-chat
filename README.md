Help and inspiration (language is russian): https://youtu.be/BwcznghxxHk?si=dKYFBOzIPwtE7SWY

AIM & MOTIVATION
- This project is training me for creating high quality products/services which are closer to real life
- I want to train my muscle memory and overall speed of completing project, when I know the design beforehand and all I have to do is to program it with some changes and improvements
- It is a good challenge for me since everything is based around communication and technology, understanding applciaiton of HTTP Requests along with sockets would help me distinguish and be able to use them appropriately
- Seing how a professional/more experienced person structures their project, makes various decisions and explains their thinking processes speeds my learning by a lot, while I am still looking for a job and people to learn from
- I aim to better understand new App Router of NextJS. It is a helpful skill given the recent change from Pages Router, as well as addition of Server Actions and replacement of previous functions related to props and params

IT'S INSPIRED BY A YOUTUBE VIDEO. WHAT DO I DO DIFFERENTLY: 
1) I see him doing a lot of @apply rules in separate CSS files. This is a common practice but is discouraged by Tailwind's maker. I think most of things can be achieved through Arbitary Values (<classname>-[<custom value>]) as well as classes being replacable and expandable in config, making it easy to see the commonly used custom classes in the project without having to open separate css, scss/sass files
2) Instead of writing class names directly inside HTML/JSX or in CSS files, I will use my strategy from one of previos projects where styling goes into an object aka dictionary which keeps them in one place near each other, without having to read HTML/JSX
3) Less complicated folder structure. Arguably a separate 'Components' folder helps the structure and readability, however NextJS allows Private Folders (<_folder name>) inside App Router which is where components can go. They can even be placed inside a directory which is part of router, as long as they don't have reserved names like 'page.tsx' or 'layout.tsx'. Keeping things closer to one another leads to better organization 