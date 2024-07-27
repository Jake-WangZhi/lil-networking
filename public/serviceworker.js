self.addEventListener("push", function (event) {
  const { title, body } = event.data.json();

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
    })
  );
});
