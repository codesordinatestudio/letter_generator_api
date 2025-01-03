export default eventHandler(async (event) => {
  return new Response("Hello, world!", {
    headers: { "content-type": "text/plain" },
  });
});
