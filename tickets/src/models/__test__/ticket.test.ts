import { Ticket } from "../tickets";

it('implements optimistic concurrency control', async () => {
  // create an instance of a ticket 
  const ticket = Ticket.build({
    title: 'consert',
    price: 5,
    userId: '123'
  })

  // save it to db

  await ticket.save()

  // fetch ticket twice 
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to each ticket
  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 15 })

  // save first ticket
  await firstInstance!.save()
  // save the second ticket 
  try {
    await secondInstance!.save()
  } catch (err) {
    return;
  };

  throw new Error('should not reach this point')
});


it('increments the version number in multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    userId: '123'
  });

  await ticket.save()

  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})