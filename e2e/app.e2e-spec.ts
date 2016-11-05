import { VideobookPage } from './app.po';

describe('ng2-videobook App', function() {
  let page: VideobookPage;

  beforeEach(() => {
    page = new VideobookPage();
  });

  it('should display message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('');
  });
});
