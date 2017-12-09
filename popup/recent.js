class RecentList {
  constructor(container) {
    this.container = container;
    this.state = [];
    this.init();
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  setState(data) {
    this.state = [].concat(data);
    this.render();
  }

  init() {
    this.container.querySelector('.list').addEventListener('click', e => {
      console.info(e.target.tagName);
      if (e.target.tagName === 'SPAN') {
        const link = e.target.parentNode;
        console.info(link);
     }
    });
  }

  onClickHandler(e) {
    e.preventDefault();
    console.log('Hello');
  }

    // this.onClick = this.onClick.bind(this);

    // this.containerEl.querySelector("button.save-collection").onclick = this.onClick;

  render() {
    // if (this.)
    const result = this.state.map(item => (new Recent(item)).render()).join('');
    this.container.querySelector('.list').innerHTML = result;
  }
}


class Recent {
  constructor(data) {
    this.template = document.getElementById('recent-item').innerHTML;
    this.state = Object.assign({
      data,
      image: this.getImage(data.cmd)
    }, data);
  }

  getImage(cmd) {
    const images = {
      TIMER: 'timer.svg',
      WEATHER: 'sun.svg',
      NPR: 'npricon.png',
      BOOKMARK: 'bookmark-icon.png',
      SPOTIFY: 'Spotify_logo_without_text.svg',
      POCKET: 'get_pocket1600.png'
    };
    return `/sidebar/resources/${images[cmd]}`;
  }

  render() {
    return this.template
      .replace('{{utterance}}', this.state.utterance)
      .replace('{{image}}', this.state.image)
      .replace('{{command}}', JSON.stringify(this.state.data));
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  const recentList = new RecentList(document.getElementById('recent-list-container'));
  const { recents } = await browser.storage.local.get('recents');
  if (recents) {
    recentList.setState(recents);
  }

  browser.storage.onChanged.addListener((changes, area) => {
    if (!changes.recents) {
      return;
    }
    recentList.setState(changes.recents.newValue);
  });
});

