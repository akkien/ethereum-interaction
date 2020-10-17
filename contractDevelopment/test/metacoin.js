const Storage = artifacts.require('Storage');

contract('Storage', (accounts) => {
  let instance = null;
  before(async () => {
    instance = await Storage.deployed();
  });

  it('should deploy successfully', async () => {
    const initNumber = await instance.get.call();

    assert.equal(initNumber, 10);
  });
  it('should set value succesfully', async () => {
    await instance.store(20, { from: accounts[1] });

    const number = await instance.get.call();

    assert.equal(number, 20);
  });
});
