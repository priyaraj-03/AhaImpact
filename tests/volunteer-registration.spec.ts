import { test, expect, Page, Locator } from '@playwright/test';

test(
  'Volunteer Registration - Complete Registration Through Application Submission',
  async ({ page }) => {

    test.setTimeout(180000);

    // ============================================================
    // TEST DATA
    // ============================================================

    const EMAILS = [
      'michael.johnson@example.com',
      'michael.johnson2026@example.com',
      'michael.johnson2027@example.com',
      'michael.johnson2028@example.com',
      'michael.johnson2029@example.com'
    ];

    const FIRST_NAME = 'Michael';
    const LAST_NAME = 'Johnson';

    // ============================================================
    // HELPER - GET VISIBLE NEXT BUTTON
    // ============================================================

    async function getVisibleNextButton(
      currentPage: Page
    ): Promise<Locator> {

      const candidates = [
        currentPage.getByRole('button', { name: /^next$/i }),
        currentPage.locator('button:has-text("Next")'),
        currentPage.locator('input[type="button"][value="Next"]'),
        currentPage.locator('input[type="submit"][value="Next"]'),
        currentPage.getByText('Next', { exact: true })
      ];

      for (const candidate of candidates) {

        const count = await candidate.count();

        for (let i = 0; i < count; i++) {

          const item = candidate.nth(i);

          if (
            !(await item.isVisible().catch(() => false))
          ) {
            continue;
          }

          const box = await item
            .boundingBox()
            .catch(() => null);

          if (!box) {
            continue;
          }

          return item;
        }
      }

      throw new Error(
        'Visible NEXT button could not be located.'
      );
    }

    // ============================================================
    // HELPER - WAIT FOR INFO FORM
    // ============================================================

    async function waitForInfoForm(currentPage: Page) {

      const firstNameField = currentPage.getByLabel(
        'First Name *',
        { exact: true }
      );

      await expect(firstNameField).toBeVisible({
        timeout: 30000
      });
    }

    // ============================================================
    // HELPER - CHECK EXISTING APPLICATION MESSAGE
    // ============================================================

    async function isExistingApplicationMessageVisible(
      currentPage: Page
    ): Promise<boolean> {

      const messageLocator = currentPage.getByText(
        /Your application is\s*under process\.\s*Please\s*hold on until its\s*verified and approved\./i
      );

      const count = await messageLocator.count();

      for (let i = 0; i < count; i++) {

        const message = messageLocator.nth(i);

        if (
          await message.isVisible().catch(() => false)
        ) {
          return true;
        }
      }

      // Backup check for slightly different spacing/text
      const backupMessage = currentPage.getByText(
        /Your application is\s*under process/i
      );

      const backupCount = await backupMessage.count();

      for (let i = 0; i < backupCount; i++) {

        if (
          await backupMessage
            .nth(i)
            .isVisible()
            .catch(() => false)
        ) {
          return true;
        }
      }

      return false;
    }

    // ============================================================
    // HELPER - FIND VISIBLE SKILL OPTION
    // ============================================================

    async function findVisibleSkill(
      skillName: string
    ): Promise<Locator | null> {

      const matches = page.getByText(
        skillName,
        { exact: true }
      );

      const count = await matches.count();

      for (let i = 0; i < count; i++) {

        const candidate = matches.nth(i);

        if (
          await candidate.isVisible().catch(() => false)
        ) {

          const box = await candidate
            .boundingBox()
            .catch(() => null);

          if (box) {
            return candidate;
          }
        }
      }

      return null;
    }

    // ============================================================
    // HELPER - SELECT THREE OPTIONS
    // ============================================================

    async function selectThreeOptions(
      optionNames: string[],
      questionName: string
    ): Promise<string[]> {

      const selectedOptions: string[] = [];

      for (const optionName of optionNames) {

        if (selectedOptions.length >= 3) {
          break;
        }

        const option = await findVisibleSkill(optionName);

        if (!option) {
          console.log(
            `${questionName}: option not visible - ${optionName}`
          );
          continue;
        }

        await option.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        const optionBox = await option.boundingBox();

        if (!optionBox) {
          continue;
        }

        console.log(
          `${questionName}: found option - ${optionName}`
        );

        const checkboxX = optionBox.x - 32;
        const checkboxY =
          optionBox.y + optionBox.height / 2;

        await page.mouse.click(
          checkboxX,
          checkboxY
        );

        await page.waitForTimeout(700);

        selectedOptions.push(optionName);

        console.log(
          `${questionName}: selected ${selectedOptions.length} - ${optionName}`
        );
      }

      return selectedOptions;
    }

    // ============================================================
    // 1. OPEN VOLUNTEER HOME
    // ============================================================

    await page.goto(
      'https://ahaimpactstagingbase.powerappsportals.com/VolunteerHome/',
      {
        waitUntil: 'domcontentloaded'
      }
    );

    // ============================================================
    // 2. CLICK FILL REGISTRATION FORM
    // ============================================================

    const registrationButton = page.getByText(
      'Fill Registration Form',
      { exact: true }
    );

    await expect(registrationButton).toBeVisible({
      timeout: 30000
    });

    await registrationButton.click();

    console.log(
      'Fill Registration Form opened successfully.'
    );

    await page.waitForLoadState(
      'domcontentloaded'
    ).catch(() => {});

    await page.waitForTimeout(3000);

    await waitForInfoForm(page);

    // ============================================================
    // 3. REQUIRED FIELD VALIDATION
    // ============================================================

    let nextButton = await getVisibleNextButton(page);

    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click();

    await page.waitForTimeout(1500);

    await expect(
      page.getByText('First Name is required', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('Last Name is required', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('Email is required', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText(
        'Emergency Contact Name is required',
        { exact: true }
      )
    ).toBeVisible();

    console.log(
      'Required field validation messages displayed successfully.'
    );

    await page.screenshot({
      path:
        'screenshots/volunteer-required-field-validation.png',
      fullPage: true
    });

    // ============================================================
    // 4. FILL INFO TAB
    // ============================================================

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const firstName = page.getByLabel(
      'First Name *',
      { exact: true }
    );

    const lastName = page.getByLabel(
      'Last Name *',
      { exact: true }
    );

    const email = page.locator('#email');

    const phoneNumber = page.getByLabel(
      'Phone Number',
      { exact: true }
    );

    const contactName = page.getByLabel(
      'Contact Name *',
      { exact: true }
    );

    const contactPhone = page.getByLabel(
      'Contact Phone *',
      { exact: true }
    );

    await firstName.fill(FIRST_NAME);
    await lastName.fill(LAST_NAME);

    await email.fill(EMAILS[0]);

    console.log(
      `Primary email entered: ${EMAILS[0]}`
    );

    await phoneNumber.fill('(415) 555-0123');

    await contactName.scrollIntoViewIfNeeded();
    await contactName.fill('Sarah Johnson');

    await contactPhone.scrollIntoViewIfNeeded();
    await contactPhone.fill('(456) 565-7676');

    // ============================================================
    // 5. VALIDATE INFO VALUES
    // ============================================================

    await expect(firstName).toHaveValue(FIRST_NAME);
    await expect(lastName).toHaveValue(LAST_NAME);
    await expect(email).toHaveValue(EMAILS[0]);
    await expect(phoneNumber).toHaveValue('(415) 555-0123');
    await expect(contactName).toHaveValue('Sarah Johnson');
    await expect(contactPhone).toHaveValue('(456) 565-7676');

    console.log(
      'All required fields were filled successfully.'
    );

    // ============================================================
    // 6. INFO -> SKILLS
    //
    // IMPORTANT:
    // Keep clicking Next with a new email whenever the
    // existing-application message is displayed.
    // ============================================================

    let emailIndex = 0;
    let emailAccepted = false;

    while (!emailAccepted) {

      nextButton = await getVisibleNextButton(page);

      await nextButton.scrollIntoViewIfNeeded();
      await nextButton.click();

      console.log(
        `NEXT clicked from Info tab using email: ${EMAILS[emailIndex]}`
      );

      // Wait for either validation/message/navigation
      await page.waitForTimeout(2500);

      const duplicateMessage =
        await isExistingApplicationMessageVisible(page);

      if (!duplicateMessage) {

        console.log(
          'Existing application message not displayed.'
        );

        console.log(
          `Email is available. Continuing with: ${EMAILS[emailIndex]}`
        );

        emailAccepted = true;
        break;
      }

      console.log(
        'Existing application message displayed.'
      );

      console.log(
        'Application already exists. Changing email address.'
      );

      emailIndex++;

      if (emailIndex >= EMAILS.length) {
        throw new Error(
          'All configured email addresses already have an existing application. Add another unused email address to EMAILS.'
        );
      }

      const newEmail = EMAILS[emailIndex];

      console.log(
        `Changing email to: ${newEmail}`
      );

      const emailField = page.locator('#email');

      await expect(emailField).toBeVisible({
        timeout: 15000
      });

      await emailField.scrollIntoViewIfNeeded();

      await emailField.fill(newEmail);

      await expect(emailField).toHaveValue(
        newEmail
      );

      console.log(
        `Email changed successfully to: ${newEmail}`
      );

      // Loop repeats and clicks Next again.
    }

    // ============================================================
    // 7. WAIT FOR SKILLS TAB
    // ============================================================

    const skillsHeading = page.getByText(
      'Skills & Experience',
      { exact: true }
    );

    await expect(skillsHeading).toBeVisible({
      timeout: 30000
    });

    console.log(
      'Skills tab loaded successfully.'
    );

    // ============================================================
    // 8. HOW WOULD YOU LIKE TO GET INVOLVED?
    // ============================================================

    const involvementLabel = page.getByText(
      'How would you like to get involved?',
      { exact: true }
    );

    await expect(involvementLabel).toBeVisible({
      timeout: 15000
    });

    await involvementLabel.scrollIntoViewIfNeeded();

    console.log(
      'How would you like to get involved? field found.'
    );

    const involvementField =
      involvementLabel.locator(
        'xpath=following::div[1]'
      );

    await expect(involvementField).toBeVisible({
      timeout: 15000
    });

    await involvementField.click();

    await page.waitForTimeout(1000);

    console.log(
      'How would you like to get involved dropdown opened.'
    );

    const clearAllFirst = page.getByText(
      'Clear all',
      { exact: true }
    );

    if (
      await clearAllFirst.isVisible().catch(() => false)
    ) {
      await clearAllFirst.click();
      await page.waitForTimeout(500);
      await involvementField.click();
      await page.waitForTimeout(500);
    }

    const firstSelected =
      await selectThreeOptions(
        ['Adventure', 'Biking', 'Fishing'],
        'How would you like to get involved?'
      );

    expect(firstSelected).toEqual([
      'Adventure',
      'Biking',
      'Fishing'
    ]);

    console.log(
      `First question selected values: ${firstSelected.join(', ')}`
    );

    await involvementField.click();
    await page.waitForTimeout(500);

    // ============================================================
    // 9. SKILLS / EXPERIENCE
    // ============================================================

    const experienceLabel = page.getByText(
      'What skills or experience can you contribute?',
      { exact: true }
    );

    await expect(experienceLabel).toBeVisible({
      timeout: 15000
    });

    await experienceLabel.scrollIntoViewIfNeeded();

    console.log(
      'What skills or experience can you contribute? field found.'
    );

    const experienceField =
      experienceLabel.locator(
        'xpath=following::div[1]'
      );

    await expect(experienceField).toBeVisible({
      timeout: 15000
    });

    await experienceField.click();

    await page.waitForTimeout(1000);

    console.log(
      'Skills/experience multi-select dropdown opened.'
    );

    const clearAllSecond = page.getByText(
      'Clear all',
      { exact: true }
    );

    if (
      await clearAllSecond.isVisible().catch(() => false)
    ) {
      await clearAllSecond.click();
      await page.waitForTimeout(500);
      await experienceField.click();
      await page.waitForTimeout(500);
    }

    const secondSelected =
      await selectThreeOptions(
        ['Hiking', 'Kayaking', 'Indoors'],
        'What skills or experience can you contribute?'
      );

    expect(secondSelected).toEqual([
      'Hiking',
      'Kayaking',
      'Indoors'
    ]);

    console.log(
      `Second question selected values: ${secondSelected.join(', ')}`
    );

    console.log(
      'Both Skills questions validated successfully.'
    );

    await page.screenshot({
      path:
        'screenshots/volunteer-skills-both-questions.png',
      fullPage: true
    });

    await experienceField.click();
    await page.waitForTimeout(500);

    // ============================================================
    // 10. SKILLS -> WAIVER
    // ============================================================

    nextButton = await getVisibleNextButton(page);

    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click();

    console.log(
      'NEXT clicked from Skills tab.'
    );

    await page.waitForTimeout(2500);

    // ============================================================
    // 11. WAIVER FORM
    // ============================================================

    const waiverForm = page.getByText(
      'Waiver Form',
      { exact: true }
    ).first();

    await expect(waiverForm).toBeVisible({
      timeout: 20000
    });

    console.log(
      'Successfully navigated to Waiver Form.'
    );

    await page.screenshot({
      path:
        'screenshots/volunteer-waiver-form.png',
      fullPage: true
    });

    // ============================================================
    // 12. CLICK NEXT WITHOUT CONSENT
    // ============================================================

    nextButton = await getVisibleNextButton(page);

    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click();

    console.log(
      'Waiver NEXT clicked without accepting consent.'
    );

    await page.waitForTimeout(1500);

    await expect(
      page.getByText(
        /Please\s+accept\s+consent/i
      ).first()
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      '"Please accept consent" validation message displayed successfully.'
    );

    // ============================================================
    // 13. ELECTRONIC SIGNATURE CONSENT
    // ============================================================

    const consentStatement = page.getByText(
      /By checking here,\s*you are consenting to the use of your electronic signature/i
    ).first();

    await expect(consentStatement).toBeVisible({
      timeout: 15000
    });

    await consentStatement.scrollIntoViewIfNeeded();

    console.log(
      'Electronic Signature Consent statement found.'
    );

    let electronicConsentCheckbox =
      consentStatement.locator(
        'xpath=ancestor::label[1]//input[@type="checkbox"]'
      ).first();

    if (
      await electronicConsentCheckbox.count() === 0
    ) {
      electronicConsentCheckbox =
        consentStatement.locator(
          'xpath=ancestor::*[.//input[@type="checkbox"]][1]//input[@type="checkbox"]'
        ).first();
    }

    if (
      await electronicConsentCheckbox.count() === 0
    ) {

      const allCheckboxes =
        page.locator(
          'input[type="checkbox"]'
        );

      const checkboxCount =
        await allCheckboxes.count();

      const consentBox =
        await consentStatement.boundingBox();

      if (!consentBox) {
        throw new Error(
          'Unable to locate Electronic Signature Consent.'
        );
      }

      let found = false;

      for (let i = 0; i < checkboxCount; i++) {

        const candidate =
          allCheckboxes.nth(i);

        const candidateBox =
          await candidate
            .boundingBox()
            .catch(() => null);

        if (!candidateBox) {
          continue;
        }

        const verticalDistance =
          Math.abs(
            candidateBox.y - consentBox.y
          );

        const horizontalDistance =
          Math.abs(
            candidateBox.x - consentBox.x
          );

        if (
          verticalDistance < 150 &&
          horizontalDistance < 200
        ) {
          electronicConsentCheckbox =
            candidate;

          found = true;
          break;
        }
      }

      if (!found) {
        throw new Error(
          'Electronic Signature Consent checkbox could not be located.'
        );
      }
    }

    await electronicConsentCheckbox.check({
      force: true
    });

    await expect(
      electronicConsentCheckbox
    ).toBeChecked();

    console.log(
      'Electronic Signature Consent checkbox is checked.'
    );

    // ============================================================
    // 14. CLICK NEXT AFTER CONSENT
    // ============================================================

    nextButton = await getVisibleNextButton(page);

    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click();

    console.log(
      'NEXT clicked after selecting Electronic Signature Consent.'
    );

    await page.waitForTimeout(2000);

    await expect(
      page.getByText(
        /Signature\s+is\s+required/i
      ).first()
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      '"Signature is required" validation message displayed successfully.'
    );

    // ============================================================
    // 15. FIND PARTICIPANT SIGNATURE
    // ============================================================

    const participantSignatureLabel =
      page.getByText(
        /Participant[’']s Signature/i,
        { exact: false }
      ).first();

    await expect(
      participantSignatureLabel
    ).toBeVisible({
      timeout: 15000
    });

    await participantSignatureLabel.scrollIntoViewIfNeeded();

    console.log(
      'Participant’s Signature label found.'
    );

    const labelBox =
      await participantSignatureLabel.boundingBox();

    if (!labelBox) {
      throw new Error(
        'Participant’s Signature label position could not be determined.'
      );
    }

    // Prefer controls located in the same nearby container.
    let signatureControl: Locator | null = null;

    const nearbyContainers = [
      participantSignatureLabel.locator(
        'xpath=ancestor::*[self::div or self::td or self::section][1]'
      ),
      participantSignatureLabel.locator(
        'xpath=parent::*'
      )
    ];

    for (const container of nearbyContainers) {

      const candidates = container.locator(
        'input:not([type="hidden"]):not([readonly]):not([disabled]), ' +
        'textarea:not([readonly]):not([disabled]), ' +
        'canvas, ' +
        '[contenteditable="true"]'
      );

      const count = await candidates.count();

      for (let i = 0; i < count; i++) {

        const candidate = candidates.nth(i);

        if (
          await candidate.isVisible().catch(() => false)
        ) {
          signatureControl = candidate;
          break;
        }
      }

      if (signatureControl) {
        break;
      }
    }

    // Fallback: find nearest editable control.
    if (!signatureControl) {

      const signatureCandidates =
        page.locator(
          'input:not([type="hidden"]):not([readonly]):not([disabled]), ' +
          'textarea:not([readonly]):not([disabled]), ' +
          'canvas, ' +
          '[contenteditable="true"]'
        );

      const candidateCount =
        await signatureCandidates.count();

      let nearestDistance =
        Number.MAX_SAFE_INTEGER;

      for (let i = 0; i < candidateCount; i++) {

        const candidate =
          signatureCandidates.nth(i);

        if (
          !(await candidate
            .isVisible()
            .catch(() => false))
        ) {
          continue;
        }

        const candidateBox =
          await candidate
            .boundingBox()
            .catch(() => null);

        if (!candidateBox) {
          continue;
        }

        const verticalDistance =
          Math.abs(
            labelBox.y - candidateBox.y
          );

        const horizontalDistance =
          Math.abs(
            labelBox.x - candidateBox.x
          );

        const distance =
          verticalDistance +
          horizontalDistance;

        if (distance < nearestDistance) {
          nearestDistance = distance;
          signatureControl = candidate;
        }
      }
    }

    if (!signatureControl) {
      throw new Error(
        'Actual Participant’s Signature control could not be located.'
      );
    }

    await expect(
      signatureControl
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Participant’s Signature control located successfully.'
    );

    const signatureTagName =
      await signatureControl.evaluate(
        element =>
          element.tagName.toLowerCase()
      );

    console.log(
      `Participant’s Signature control type: ${signatureTagName}`
    );

    // ============================================================
    // 16. ENTER SIGNATURE
    // ============================================================

    if (
      signatureTagName === 'input' ||
      signatureTagName === 'textarea'
    ) {

      await signatureControl.fill('Michael');

      await expect(
        signatureControl
      ).toHaveValue('Michael');

      console.log(
        'Participant signature entered successfully: Michael'
      );

    } else if (
      await signatureControl.getAttribute(
        'contenteditable'
      ) === 'true'
    ) {

      await signatureControl.click();

      await signatureControl.fill('Michael');

      console.log(
        'Participant signature entered successfully: Michael'
      );

    } else if (
      signatureTagName === 'canvas'
    ) {

      await signatureControl.scrollIntoViewIfNeeded();

      const canvasBox =
        await signatureControl.boundingBox();

      if (!canvasBox) {
        throw new Error(
          'Participant Signature canvas position could not be determined.'
        );
      }

      const startX =
        canvasBox.x + 30;

      const startY =
        canvasBox.y +
        canvasBox.height / 2;

      await page.mouse.move(
        startX,
        startY
      );

      await page.mouse.down();

      await page.mouse.move(
        startX + 10,
        startY - 15
      );

      await page.mouse.move(
        startX + 20,
        startY + 10
      );

      await page.mouse.move(
        startX + 35,
        startY - 15
      );

      await page.mouse.move(
        startX + 50,
        startY + 10
      );

      await page.mouse.move(
        startX + 70,
        startY - 5
      );

      await page.mouse.move(
        startX + 90,
        startY + 5
      );

      await page.mouse.move(
        startX + 115,
        startY - 5
      );

      await page.mouse.up();

      console.log(
        'Participant signature drawn successfully.'
      );
    }

    await page.waitForTimeout(1500);

    await page.screenshot({
      path:
        'screenshots/volunteer-waiver-signature-entered.png',
      fullPage: true
    });

    console.log(
      'Waiver signature screenshot captured successfully.'
    );

    // ============================================================
    // 17. WAIVER -> BACKGROUND CHECK
    // ============================================================

    nextButton = await getVisibleNextButton(page);

    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click();

    console.log(
      'NEXT clicked from Waiver Form.'
    );

    await page.waitForTimeout(2500);

    const backgroundCheck =
      page.getByText(
        'Background Check',
        { exact: true }
      ).first();

    await expect(
      backgroundCheck
    ).toBeVisible({
      timeout: 20000
    });

    console.log(
      'Successfully navigated to Background Check tab.'
    );

    await page.screenshot({
      path:
        'screenshots/volunteer-background-check.png',
      fullPage: true
    });

    // ============================================================
    // 18. BACKGROUND CHECK -> ONBOARDING
    // ============================================================

    nextButton = await getVisibleNextButton(page);

    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click();

    console.log(
      'NEXT clicked from Background Check.'
    );

    await page.waitForTimeout(2500);

    const onboardingHeading =
      page.getByText(
        'Onboarding',
        { exact: true }
      ).first();

    await expect(
      onboardingHeading
    ).toBeVisible({
      timeout: 20000
    });

    console.log(
      'Successfully navigated to Onboarding tab.'
    );

    // ============================================================
    // 19. ONBOARDING QUESTIONS
    // ============================================================

    const onboardingQuestions = [
      {
        question:
          'What inspired you to become a volunteer with our organization?',
        answer:
          'I wanted to give back to my community and make a positive difference in the lives of others.'
      },
      {
        question:
          'Tell us something unique or interesting about yourself?',
        answer:
          'I enjoy learning new skills, exploring new places, and volunteering at community events.'
      },
      {
        question:
          'Do you have a personal connection to our mission or the people we serve? Please explain.',
        answer:
          'Yes. I have always valued supporting older adults and helping people feel connected and cared for.'
      },
      {
        question:
          'Describe any experience you have working with older adults or senior communities.',
        answer:
          'I have volunteered at community activities and enjoyed spending time with older adults, assisting with activities and providing companionship.'
      }
    ];

    for (const item of onboardingQuestions) {

      console.log(
        `Locating Onboarding question: ${item.question}`
      );

      const questionLabel =
        page.getByText(
          item.question,
          { exact: true }
        ).first();

      await expect(
        questionLabel
      ).toBeVisible({
        timeout: 15000
      });

      await questionLabel.scrollIntoViewIfNeeded();

      let responseControl =
        questionLabel.locator(
          'xpath=following::textarea[1]'
        );

      if (
        !(await responseControl
          .isVisible()
          .catch(() => false))
      ) {

        responseControl =
          questionLabel.locator(
            'xpath=following::input[not(@type="hidden")][1]'
          );
      }

      await expect(
        responseControl
      ).toBeVisible({
        timeout: 10000
      });

      await responseControl.fill(
        item.answer
      );

      console.log(
        `Response entered successfully for: ${item.question}`
      );
    }

    console.log(
      'All 4 Onboarding questions were answered successfully.'
    );

    await page.screenshot({
      path:
        'screenshots/volunteer-onboarding.png',
      fullPage: true
    });

    // ============================================================
    // 20. ONBOARDING -> SUMMARY
    // ============================================================

    nextButton = await getVisibleNextButton(page);

    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click();

    console.log(
      'NEXT clicked from Onboarding.'
    );

    await page.waitForTimeout(2500);

    const summaryHeading =
      page.getByText(
        'Summary',
        { exact: true }
      ).first();

    await expect(
      summaryHeading
    ).toBeVisible({
      timeout: 20000
    });

    console.log(
      'Successfully navigated to Summary tab.'
    );

    await page.screenshot({
      path:
        'screenshots/volunteer-summary.png',
      fullPage: true
    });

    // ============================================================
    // 21. SUBMIT APPLICATION
    // ============================================================

    const submitApplicationButton =
      page.getByRole(
        'button',
        {
          name: /submit application/i
        }
      ).first();

    await expect(
      submitApplicationButton
    ).toBeVisible({
      timeout: 20000
    });

    console.log(
      'Submit Application button located successfully.'
    );

    await submitApplicationButton.scrollIntoViewIfNeeded();

    await submitApplicationButton.click();

    console.log(
      'Submit Application button clicked.'
    );

    // ============================================================
    // 22. WAIT FOR THANK YOU PAGE
    //
    // The application redirects directly to the Thank You page.
    // Do not wait for "Application Submitted Successfully"
    // because that message may not exist on the destination page.
    // ============================================================

    await page.waitForURL(
      /Volunteer-Thankyou-page/i,
      {
        timeout: 30000
      }
    );

    console.log(
      'Application submitted successfully.'
    );

    console.log(
      `Thank You page URL: ${page.url()}`
    );

    // ============================================================
    // 23. THANK YOU PAGE
    // ============================================================

    await page.waitForLoadState(
      'domcontentloaded'
    ).catch(() => {});

    await page.waitForTimeout(2000);

    await expect(
      page.locator('body')
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Thank You page displayed successfully.'
    );

    // ============================================================
    // 24. WAIT 2 SECONDS AND CAPTURE SCREENSHOT
    // ============================================================

    await page.waitForTimeout(2000);

    await page.screenshot({
      path:
        'screenshots/volunteer-thank-you-page.png',
      fullPage: true
    });

    console.log(
      'Thank You page screenshot captured successfully.'
    );

    // ============================================================
    // 25. END TEST
    // ============================================================

    console.log(
      'Volunteer Registration completed successfully.'
    );

    console.log(
      'Thank You page displayed. Ending script.'
    );

    // No further navigation or actions.
  }
);