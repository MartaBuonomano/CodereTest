import { test, expect } from '@playwright/test';

//Possible Improvements:
//1- For this tests I've used an account I’ve created with my credentials but it should be a test account, preferably, we should create a createUser function to use it for every test we need that allow us to create a new user with random name and password
//2- To make the whole test more readble it would be better to create descriptive fuctions (e.g. "loginWithValidCredentials", "loginWithInvalidPassord", "loginWithInvalidUsername", etc.) containing the related code
//3- It will be also useful to have data-testids to have stable ids all stored in a file to re-use them when necessary
//4- A nice improvement would be also link the test cases to the tests themselves
test.describe('Login for Codere', () => {

  const validUserData = {
    user: 'MartaBuonomano',
    password: 'CodereTest123!'
  };
  const invalidUserData = {
    user: 'BuonomanoMarta123',
    password: 'invalidPassword'
  };

  //I used the beforeEach to avoid use the page.togo() and the accept cookies in every test. It would be useful to have a general common function to accept cookies outside the test so we can use it whenever we want
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'ACEPTAR' }).click();
  });

  //Happy Path - checking the response statusCode, parameterers and values
  test('I can properly do the login with valid username and password', async ({ page }) => {
    await page.getByRole('button', { name: 'Acceder' }).click();
    await page.getByRole('textbox', { name: 'Usuario / Correo electrónico' }).fill(validUserData.user);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(validUserData.password);
    await page.click('button[type=submit]');
    const response = await page.waitForResponse('/csbgonline/account/loginjson')
    const respBody = await response.json()
    expect(response.status()).toEqual(200)
    expect(respBody.status).toBe('ok')
    expect(respBody.success).toBe(true)

  });

  //Error Case n.1 - Using an invalid username - checking the response parameterers and values
  //NOTE: If I put an invalid user (regardless if the password is valid or not) it keeps loading with no error message, but it would be great to show an error message for the user 
  //NOTE: In every of the following error cases the statusCode is 200 even if the credentials are invalid, so I could just check the properties’ values of the call. It would be useful to have an error statusCode (e.g 401 Unauthorized) to check it in the tests
  test(`I can't do the login with invalid username`, async ({ page }) => {
    await page.getByRole('button', { name: 'Acceder' }).click();
    await page.getByRole('textbox', { name: 'Usuario / Correo electrónico' }).fill(validUserData.user);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(invalidUserData.password);
    await page.click('button[type=submit]');
    const response = await page.waitForResponse('/csbgonline/account/loginjson')
    const respBody = await response.json()
    expect(respBody.status).toBe('notfound')
    expect(respBody.success).toBe(false)
  });

//Error Case n.2 - Using an invalid password - checking the response parameterers and values
  test(`I can't do the login with invalid password`, async ({ page }) => {
    await page.click('text=Acceder');
    await page.fill('input[name="username"]', validUserData.user);
    await page.fill('input[name="password"]', invalidUserData.password);
    await page.click('button[type=submit]');
    const response = await page.waitForResponse('/csbgonline/account/loginjson')
    const respBody = await response.json()
    expect(respBody.status).toBe('notfound')
    expect(respBody.success).toBe(false)
    await page.getByText('Error de inicio de sesión').isVisible();

  });

  //Error Case n.3 - Using an invalid username and an invalid password - checking the response parameterers and values
  //NOTE: Same behaviour of the Error Case 1 - If I put an invalid user (regardless if the password is valid or not) it keeps loading with no error message, but it would be great to show an error message for the user 
  test(`I can't do the login with invalid username and password`, async ({ page }) => {
    await page.click('text=Acceder');
    await page.fill('input[name="username"]', invalidUserData.user);
    await page.fill('input[name="password"]', invalidUserData.password);
    await page.click('button[type=submit]');
    const response = await page.waitForResponse('/csbgonline/account/loginjson')
    const respBody = await response.json()
    expect(respBody.status).toBe('notfound')
    expect(respBody.success).toBe(false)
    await page.getByText('Error de inicio de sesión').isVisible();

  });
  
  //Error Case n.4 - Click on the login button without adding username and password - checking the error message
  test(`I can't do the login with no username and password`, async ({ page }) => {
    await page.click('text=Acceder');
    await page.click('button[type=submit]');
    await page.waitForSelector('#alert-msg-1', { state: 'visible' });
    await page.getByText('Revisa que todos los campos estén rellenos').isVisible();
  });


  //Error Case n.5 - Checkout - checking the response parameterers and values
  test('I can validate the logout in Codere page', async ({ page }) => {
    await page.getByRole('button', { name: 'Acceder' }).click();
    await page.getByRole('textbox', { name: 'Usuario / Correo electrónico' }).fill(validUserData.user);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(validUserData.password);
    await page.click('button[type=submit]');
    const responseLogin = await page.waitForResponse('/csbgonline/account/loginjson')
    const respBodyLogin = await responseLogin.json()
    expect(responseLogin.status()).toEqual(200)
    expect(respBodyLogin.status).toBe('ok')
    expect(respBodyLogin.success).toBe(true)
    await page.locator('codere-navbar-pc-submenu i').click();
    await page.getByText('Cerrar sesión').click();
    const responseLogout = await page.waitForResponse('/csbgonline/account/logOff')
    const respBodyLogout = await responseLogout.json()
    expect(responseLogout.status()).toEqual(200)
    expect(respBodyLogout.success).toBe(true)
  });

});

