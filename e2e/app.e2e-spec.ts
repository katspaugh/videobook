import { Ng2VideobookPage } from './app.po';

describe('ng2-videobook App', function() {
  let page: Ng2VideobookPage;

  beforeEach(() => {
    page = new Ng2VideobookPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
