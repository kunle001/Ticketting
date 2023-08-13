# TicketX: Microservices-based Ticketing Website API

TicketX is an innovative ticketing website API that leverages microservices architecture to provide seamless ticketing experiences for various events, including movies, concerts, operas, and sports events. One of our unique features is the ability to find ticket holders willing to sell their tickets even if an event is sold out.

## Software and Tools Requirements

To contribute or use TicketX, you'll need the following:

1. A [GitHub account](https://github.com/kunle001) for collaboration and version control.
2. [Visual Studio Code (VS Code)](https://code.visualstudio.com/), a versatile and widely-used integrated development environment.

## Microservices Architecture

TicketX employs a microservices architecture, enabling efficient communication and interaction among six distinct services:

1. **Authentication Service:** Manages user authentication, including login, signup, password management, and secure session handling using JWT. Sensitive data is protected, and cookies are securely managed.

2. **Comment Service:** Handles the creation, editing, and deletion of comments related to tickets, facilitating user engagement and interaction.

3. **Ticketing Service:** Responsible for all aspects of ticket management, from uploading tickets for sale to setting prices and deleting listings.

4. **Payment Service:** Manages payment logic and processes, including payment approvals, security measures, and payment disapprovals.

5. **Orders Service:** Facilitates the process of making ticket orders, enabling users to express their interest in obtaining tickets.

6. **Expiration Service:** Ensures the timely expiration of tickets or orders that are no longer valid, maintaining data accuracy.

## Technologies and Tools

TicketX utilizes a robust tech stack for its microservices architecture:

- Docker and Kubernetes for containerization and orchestration.
- Skaffold for streamlining the development workflow.
- MongoDB for efficient and scalable database management.
- TypeScript for type-safe and maintainable code.
- Express as the backend framework for building RESTful APIs.
- NATS Service for seamless communication between microservices.

## Frontend Framework

TicketX's frontend is powered by Next.js, a popular framework that enables server-side rendering and enhanced user experiences.

## Backend Technologies

The backend of TicketX is built with Node.js and Express, providing a robust foundation for handling API requests and data processing.

## Cloud Services

TicketX is to be hosted on AWS (Amazon Web Services), ensuring high availability and scalability. Additionally, Namecheap services are utilized for domain management.

I am excited to soon launch TicketX and provide a revolutionary ticketing experience that integrates microservices architecture, cutting-edge technologies, and user-centered features. Stay tuned for more updates and our official launch!
