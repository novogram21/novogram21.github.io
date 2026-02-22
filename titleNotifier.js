const TitleNotifier = (() => {
  const ORIGINAL_TITLE = 'Novogram';
  let unreadCount = 0;
  let blinkInterval = null;
  let isTitleShowing = true;

  // Русское склонение: 1 новое / 2 новых / 5 новых
  function getLabel(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 19) return `${count} новых сообщений`;
    if (mod10 === 1) return `${count} новое сообщение`;
    if (mod10 >= 2 && mod10 <= 4) return `${count} новых сообщения`;
    return `${count} новых сообщений`;
  }

  function startBlinking() {
    if (blinkInterval) return; // уже мигает
    blinkInterval = setInterval(() => {
      document.title = isTitleShowing
        ? getLabel(unreadCount)
        : ORIGINAL_TITLE;
      isTitleShowing = !isTitleShowing;
    }, 1000);
  }

  function stopBlinking() {
    clearInterval(blinkInterval);
    blinkInterval = null;
    isTitleShowing = true;
    document.title = ORIGINAL_TITLE;
    unreadCount = 0;
  }

  // Когда пользователь возвращается на вкладку — сбрасываем
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) stopBlinking();
  });

  // Публичный метод — вызывай при получении нового сообщения
  function onNewMessage() {
    if (document.hidden) {
      unreadCount++;
      startBlinking();
    }
  }

  return { onNewMessage, stopBlinking };
})();
