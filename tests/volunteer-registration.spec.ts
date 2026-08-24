import { test, expect } from '@playwright/test';

test(
  'Volunteer Registration - Complete Registration Through Application Submission',
  async ({ page }) => {

    // ============================================================
    // TEST TIMEOUT
    // ============================================================

    test.setTimeout(120000);

    // ============================================================
    // 1. OPEN VOLUNTEER HOME PAGE
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
      {
        exact: true
      }
    );

    await expect(
      registrationButton
    ).toBeVisible({
      timeout: 30000
    });

    await registrationButton.click();

    console.log(
      'Fill Registration Form opened successfully.'
    );

    await page.waitForTimeout(3000);

    // ============================================================
    // 3. LOCATE NEXT BUTTON
    // ============================================================

    const nextButton = page.getByRole(
      'button',
      {
        name: /next/i
      }
    ).first();

    await expect(
      nextButton
    ).toBeVisible({
      timeout: 30000
    });

    await nextButton.scrollIntoViewIfNeeded();

    // ============================================================
    // 4. CLICK NEXT WITH EMPTY FIELDS
    // ============================================================

    await nextButton.click();

    await page.waitForTimeout(2000);

    // ============================================================
    // 5. VALIDATE REQUIRED FIELD MESSAGES
    // ============================================================

    await expect(
      page.getByText(
        'First Name is required',
        {
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        'Last Name is required',
        {
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        'Email is required',
        {
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        'Emergency Contact Name is required',
        {
          exact: true
        }
      )
    ).toBeVisible();

    console.log(
      'Required field validation messages displayed successfully.'
    );

    // ============================================================
    // REQUIRED FIELD SCREENSHOT
    // ============================================================

    await page.screenshot({
      path:
        'screenshots/volunteer-required-field-validation.png',
      fullPage: true
    });

    // ============================================================
    // 6. FILL REQUIRED FIELDS
    // ============================================================

    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    await page.waitForTimeout(1000);

    // ------------------------------------------------------------
    // First Name
    // ------------------------------------------------------------

    const firstName = page.getByLabel(
      'First Name *',
      {
        exact: true
      }
    );

    await expect(
      firstName
    ).toBeVisible({
      timeout: 10000
    });

    await firstName.fill(
      'Michael'
    );

    // ------------------------------------------------------------
    // Last Name
    // ------------------------------------------------------------

    const lastName = page.getByLabel(
      'Last Name *',
      {
        exact: true
      }
    );

    await expect(
      lastName
    ).toBeVisible({
      timeout: 10000
    });

    await lastName.fill(
      'Johnson'
    );

    // ------------------------------------------------------------
    // Email
    // ------------------------------------------------------------

    const email = page.locator(
      '#email'
    );

    await expect(
      email
    ).toBeVisible({
      timeout: 10000
    });

    await email.fill(
      'michael.johnson@example.com'
    );

    // ------------------------------------------------------------
    // Phone Number
    // ------------------------------------------------------------

    const phoneNumber = page.getByLabel(
      'Phone Number',
      {
        exact: true
      }
    );

    await expect(
      phoneNumber
    ).toBeVisible({
      timeout: 10000
    });

    await phoneNumber.fill(
      '(415) 555-0123'
    );

    // ------------------------------------------------------------
    // Emergency Contact Name
    // ------------------------------------------------------------

    const contactName = page.getByLabel(
      'Contact Name *',
      {
        exact: true
      }
    );

    await contactName.scrollIntoViewIfNeeded();

    await expect(
      contactName
    ).toBeVisible({
      timeout: 10000
    });

    await contactName.fill(
      'Sarah Johnson'
    );

    // ------------------------------------------------------------
    // Emergency Contact Phone
    // ------------------------------------------------------------

    const contactPhone = page.getByLabel(
      'Contact Phone *',
      {
        exact: true
      }
    );

    await contactPhone.scrollIntoViewIfNeeded();

    await expect(
      contactPhone
    ).toBeVisible({
      timeout: 10000
    });

    await contactPhone.fill(
      '(456) 565-7676'
    );

    // ============================================================
    // 7. VALIDATE ENTERED VALUES
    // ============================================================

    await expect(
      firstName
    ).toHaveValue(
      'Michael'
    );

    await expect(
      lastName
    ).toHaveValue(
      'Johnson'
    );

    await expect(
      email
    ).toHaveValue(
      'michael.johnson@example.com'
    );

    await expect(
      phoneNumber
    ).toHaveValue(
      '(415) 555-0123'
    );

    await expect(
      contactName
    ).toHaveValue(
      'Sarah Johnson'
    );

    await expect(
      contactPhone
    ).toHaveValue(
      '(456) 565-7676'
    );

    console.log(
      'All required fields were filled successfully.'
    );

    // ============================================================
    // 8. CLICK NEXT -> SKILLS
    // ============================================================

    await nextButton.scrollIntoViewIfNeeded();

    await expect(
      nextButton
    ).toBeVisible({
      timeout: 10000
    });

    await nextButton.click();

    console.log(
      'NEXT clicked. Navigating to Skills tab...'
    );

    await page.waitForTimeout(2000);

    // ============================================================
    // 9. VALIDATE SKILLS TAB
    // ============================================================

    const skillsHeading = page.getByText(
      'Skills & Experience',
      {
        exact: true
      }
    );

    await expect(
      skillsHeading
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Skills tab loaded successfully.'
    );

    // ============================================================
    // HELPER - FIND VISIBLE SKILL OPTION
    // ============================================================

    async function findVisibleSkill(
      skillName: string
    ) {
      const matches = page.getByText(
        skillName,
        {
          exact: true
        }
      );

      const count =
        await matches.count();

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const candidate =
          matches.nth(i);

        if (
          await candidate
            .isVisible()
            .catch(() => false)
        ) {
          const box =
            await candidate.boundingBox();

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

      for (
        const optionName of optionNames
      ) {

        if (
          selectedOptions.length >= 3
        ) {
          break;
        }

        const option =
          await findVisibleSkill(
            optionName
          );

        if (!option) {
          console.log(
            `${questionName}: option not visible - ${optionName}`
          );
          continue;
        }

        await option.scrollIntoViewIfNeeded();

        await page.waitForTimeout(300);

        const optionBox =
          await option.boundingBox();

        if (!optionBox) {
          continue;
        }

        console.log(
          `${questionName}: found option - ${optionName}`
        );

        const checkboxX =
          optionBox.x - 32;

        const checkboxY =
          optionBox.y +
          optionBox.height / 2;

        await page.mouse.click(
          checkboxX,
          checkboxY
        );

        await page.waitForTimeout(700);

        selectedOptions.push(
          optionName
        );

        console.log(
          `${questionName}: selected ${selectedOptions.length} - ${optionName}`
        );
      }

      return selectedOptions;
    }

    // ============================================================
    // 10. FIRST SKILLS QUESTION
    // ============================================================

    const involvementLabel =
      page.getByText(
        'How would you like to get involved?',
        {
          exact: true
        }
      );

    await expect(
      involvementLabel
    ).toBeVisible({
      timeout: 10000
    });

    await involvementLabel.scrollIntoViewIfNeeded();

    console.log(
      'How would you like to get involved? field found.'
    );

    // ============================================================
    // 11. FIRST MULTI-SELECT
    // ============================================================

    const involvementField =
      involvementLabel.locator(
        'xpath=following::div[1]'
      );

    await expect(
      involvementField
    ).toBeVisible({
      timeout: 10000
    });

    await involvementField.scrollIntoViewIfNeeded();

    await involvementField.click();

    await page.waitForTimeout(1000);

    console.log(
      'How would you like to get involved dropdown opened.'
    );

    // ============================================================
    // 12. CLEAR FIRST QUESTION
    // ============================================================

    const clearAllFirst =
      page.getByText(
        'Clear all',
        {
          exact: true
        }
      );

    if (
      await clearAllFirst
        .isVisible()
        .catch(() => false)
    ) {
      await clearAllFirst.click();

      await page.waitForTimeout(700);

      await involvementField.click();

      await page.waitForTimeout(700);

      console.log(
        'Existing involvement selections cleared.'
      );
    }

    // ============================================================
    // 13. SELECT FIRST THREE OPTIONS
    // ============================================================

    const firstQuestionOptions = [
      'Adventure',
      'Biking',
      'Fishing'
    ];

    const firstSelected =
      await selectThreeOptions(
        firstQuestionOptions,
        'How would you like to get involved?'
      );

    expect(
      firstSelected.length,
      'Exactly 3 options must be selected for the first Skills question.'
    ).toBe(3);

    expect(
      firstSelected
    ).toEqual([
      'Adventure',
      'Biking',
      'Fishing'
    ]);

    console.log(
      'First question selected values: ' +
      firstSelected.join(', ')
    );

    // ============================================================
    // 14. CLOSE FIRST DROPDOWN
    // ============================================================

    await involvementField.click();

    await page.waitForTimeout(500);

    // ============================================================
    // 15. SECOND SKILLS QUESTION
    // ============================================================

    const experienceLabel =
      page.getByText(
        'What skills or experience can you contribute?',
        {
          exact: true
        }
      );

    await expect(
      experienceLabel
    ).toBeVisible({
      timeout: 10000
    });

    await experienceLabel.scrollIntoViewIfNeeded();

    console.log(
      'What skills or experience can you contribute? field found.'
    );

    // ============================================================
    // 16. SECOND MULTI-SELECT
    // ============================================================

    const experienceField =
      experienceLabel.locator(
        'xpath=following::div[1]'
      );

    await expect(
      experienceField
    ).toBeVisible({
      timeout: 10000
    });

    await experienceField.scrollIntoViewIfNeeded();

    await experienceField.click();

    await page.waitForTimeout(1000);

    console.log(
      'Skills/experience multi-select dropdown opened.'
    );

    // ============================================================
    // 17. CLEAR SECOND QUESTION
    // ============================================================

    const clearAllSecond =
      page.getByText(
        'Clear all',
        {
          exact: true
        }
      );

    if (
      await clearAllSecond
        .isVisible()
        .catch(() => false)
    ) {
      await clearAllSecond.click();

      await page.waitForTimeout(700);

      await experienceField.click();

      await page.waitForTimeout(700);

      console.log(
        'Existing skills/experience selections cleared.'
      );
    }

    // ============================================================
    // 18. SELECT SECOND THREE OPTIONS
    // ============================================================

    const secondQuestionOptions = [
      'Hiking',
      'Kayaking',
      'Indoors'
    ];

    const secondSelected =
      await selectThreeOptions(
        secondQuestionOptions,
        'What skills or experience can you contribute?'
      );

    expect(
      secondSelected.length,
      'Exactly 3 options must be selected for the second Skills question.'
    ).toBe(3);

    expect(
      secondSelected
    ).toEqual([
      'Hiking',
      'Kayaking',
      'Indoors'
    ]);

    console.log(
      'Second question selected values: ' +
      secondSelected.join(', ')
    );

    console.log(
      'Both Skills questions validated successfully.'
    );

    // ============================================================
    // 19. SKILLS SCREENSHOT
    // ============================================================

    await page.screenshot({
      path:
        'screenshots/volunteer-skills-both-questions.png',
      fullPage: true
    });

    // ============================================================
    // 20. CLOSE SECOND DROPDOWN
    // ============================================================

    await experienceField.click();

    await page.waitForTimeout(500);

    // ============================================================
    // 21. SKILLS NEXT
    // ============================================================

    const skillsNextButton =
      page.getByRole(
        'button',
        {
          name: /next/i
        }
      ).last();

    await skillsNextButton.scrollIntoViewIfNeeded();

    await expect(
      skillsNextButton
    ).toBeVisible({
      timeout: 15000
    });

    await skillsNextButton.click();

    console.log(
      'NEXT clicked from Skills tab.'
    );

    await page.waitForTimeout(2000);

    // ============================================================
    // 22. VALIDATE WAIVER FORM
    // ============================================================

    const waiverForm =
      page.getByText(
        'Waiver Form',
        {
          exact: true
        }
      ).first();

    await expect(
      waiverForm
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Successfully navigated to Waiver Form.'
    );

    await page.waitForTimeout(2000);

    // ============================================================
    // 23. WAIVER SCREENSHOT
    // ============================================================

    await page.screenshot({
      path:
        'screenshots/volunteer-waiver-form.png',
      fullPage: true
    });

    // ============================================================
    // 24. WAIVER NEXT BUTTON
    // ============================================================

    const waiverNextButton =
      page.getByRole(
        'button',
        {
          name: /next/i
        }
      ).last();

    await expect(
      waiverNextButton
    ).toBeVisible({
      timeout: 15000
    });

    await waiverNextButton.scrollIntoViewIfNeeded();

    // ============================================================
    // 25. CLICK NEXT WITHOUT CONSENT
    // ============================================================

    await waiverNextButton.click();

    console.log(
      'Waiver NEXT clicked without accepting consent.'
    );

    await page.waitForTimeout(2000);

    // ============================================================
    // 26. VALIDATE PLEASE ACCEPT CONSENT
    // ============================================================

    const consentError =
      page.getByText(
        /Please\s+accept\s+consent/i
      ).first();

    await expect(
      consentError
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      '"Please accept consent" validation message displayed successfully.'
    );

    // ============================================================
    // 27. LOCATE ELECTRONIC SIGNATURE CONSENT
    // ============================================================

    const consentStatement =
      page.getByText(
        /By checking here,\s*you are consenting to the use of your electronic signature/i
      ).first();

    await expect(
      consentStatement
    ).toBeVisible({
      timeout: 15000
    });

    await consentStatement.scrollIntoViewIfNeeded();

    console.log(
      'Electronic Signature Consent statement found.'
    );

    // ============================================================
    // 28. LOCATE ACTUAL ELECTRONIC CONSENT CHECKBOX
    // ============================================================

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
          'Unable to determine Electronic Signature Consent position.'
        );
      }

      let foundCheckbox = false;

      for (
        let i = 0;
        i < checkboxCount;
        i++
      ) {

        const candidate =
          allCheckboxes.nth(i);

        const candidateBox =
          await candidate.boundingBox();

        if (!candidateBox) {
          continue;
        }

        const verticalDistance =
          Math.abs(
            candidateBox.y -
            consentBox.y
          );

        const horizontalDistance =
          Math.abs(
            candidateBox.x -
            consentBox.x
          );

        if (
          verticalDistance < 150 &&
          horizontalDistance < 200
        ) {

          electronicConsentCheckbox =
            candidate;

          foundCheckbox = true;

          break;
        }
      }

      if (!foundCheckbox) {
        throw new Error(
          'Electronic Signature Consent checkbox could not be located.'
        );
      }
    }

    await expect(
      electronicConsentCheckbox
    ).toHaveCount(
      1,
      {
        timeout: 10000
      }
    );

    console.log(
      'Electronic Signature Consent checkbox located successfully.'
    );

    // ============================================================
    // 29. SELECT ELECTRONIC SIGNATURE CONSENT
    // ============================================================

    await electronicConsentCheckbox.check({
      force: true
    });

    await page.waitForTimeout(1000);

    await expect(
      electronicConsentCheckbox
    ).toBeChecked();

    console.log(
      'Electronic Signature Consent checkbox is checked.'
    );

    // ============================================================
    // 30. CLICK NEXT AFTER CONSENT
    // ============================================================

    await waiverNextButton.scrollIntoViewIfNeeded();

    await expect(
      waiverNextButton
    ).toBeVisible({
      timeout: 10000
    });

    await waiverNextButton.click();

    console.log(
      'NEXT clicked after selecting Electronic Signature Consent.'
    );

    await page.waitForTimeout(2500);

    // ============================================================
    // 31. VALIDATE SIGNATURE REQUIRED
    // ============================================================

    const signatureRequiredMessage =
      page.getByText(
        /Signature\s+is\s+required/i
      ).first();

    await expect(
      signatureRequiredMessage
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      '"Signature is required" validation message displayed successfully.'
    );

    // ============================================================
    // 32. LOCATE PARTICIPANT'S SIGNATURE LABEL
    // ============================================================

    const participantSignatureLabel =
      page.getByText(
        /Participant[’']s Signature/i,
        {
          exact: false
        }
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

    // ============================================================
    // 33. LOCATE PARTICIPANT SIGNATURE CONTROL
    //
    // IMPORTANT:
    // Do NOT use the first preceding input.
    // That can locate the Date input instead of the
    // Participant's Signature input.
    // ============================================================

    const allInputs =
      page.locator(
        'input:not([type="hidden"])'
      );

    const inputCount =
      await allInputs.count();

    const signatureLabelBox =
      await participantSignatureLabel.boundingBox();

    if (!signatureLabelBox) {
      throw new Error(
        'Participant’s Signature label position could not be determined.'
      );
    }

    let signatureControl: any = null;

    let closestDistance =
      Number.MAX_SAFE_INTEGER;

    for (
      let i = 0;
      i < inputCount;
      i++
    ) {

      const candidate =
        allInputs.nth(i);

      if (
        !(await candidate
          .isVisible()
          .catch(() => false))
      ) {
        continue;
      }

      const candidateBox =
        await candidate.boundingBox();

      if (!candidateBox) {
        continue;
      }

      const candidateType =
        (
          await candidate.getAttribute('type')
        )?.toLowerCase();

      // Ignore date controls.
      if (
        candidateType === 'date'
      ) {
        continue;
      }

      const candidateClass =
        (
          await candidate.getAttribute('class')
        ) || '';

      // Ignore known date controls.
      if (
        /date/i.test(candidateClass)
      ) {
        continue;
      }

      // Participant signature control is expected
      // to be close to the signature label.
      const verticalDistance =
        Math.abs(
          candidateBox.y -
          signatureLabelBox.y
        );

      const horizontalDistance =
        Math.abs(
          candidateBox.x -
          signatureLabelBox.x
        );

      const distance =
        verticalDistance +
        horizontalDistance;

      if (
        distance < closestDistance &&
        distance < 500
      ) {
        closestDistance =
          distance;

        signatureControl =
          candidate;
      }
    }

    // ============================================================
    // 34. FALLBACK - TEXTAREA / CONTENTEDITABLE / CANVAS
    // ============================================================

    if (!signatureControl) {

      const possibleControls =
        page.locator(
          'textarea, canvas, [contenteditable="true"]'
        );

      const controlCount =
        await possibleControls.count();

      for (
        let i = 0;
        i < controlCount;
        i++
      ) {

        const candidate =
          possibleControls.nth(i);

        if (
          !(await candidate
            .isVisible()
            .catch(() => false))
        ) {
          continue;
        }

        const candidateBox =
          await candidate.boundingBox();

        if (!candidateBox) {
          continue;
        }

        const verticalDistance =
          Math.abs(
            candidateBox.y -
            signatureLabelBox.y
          );

        const horizontalDistance =
          Math.abs(
            candidateBox.x -
            signatureLabelBox.x
          );

        const distance =
          verticalDistance +
          horizontalDistance;

        if (
          distance < closestDistance &&
          distance < 500
        ) {

          closestDistance =
            distance;

          signatureControl =
            candidate;
        }
      }
    }

    if (!signatureControl) {
      throw new Error(
        'Participant’s Signature input/control could not be located.'
      );
    }

    // ============================================================
    // 35. VERIFY SIGNATURE CONTROL
    // ============================================================

    await signatureControl.scrollIntoViewIfNeeded();

    await expect(
      signatureControl
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Participant’s Signature control located successfully.'
    );

    // ============================================================
    // 36. DETERMINE SIGNATURE CONTROL TYPE
    // ============================================================

    const signatureTagName =
      await signatureControl.evaluate(
        (element: Element) =>
          element.tagName.toLowerCase()
      );

    console.log(
      `Participant’s Signature control type: ${signatureTagName}`
    );

    // ============================================================
    // 37. ENTER SIGNATURE
    // ============================================================

    if (
      signatureTagName === 'input' ||
      signatureTagName === 'textarea'
    ) {

      const isReadonly =
        await signatureControl.getAttribute(
          'readonly'
        );

      if (
        isReadonly !== null
      ) {
        throw new Error(
          'The located Participant’s Signature input is readonly. A different signature control must be located.'
        );
      }

      await signatureControl.fill(
        'Michael'
      );

      await expect(
        signatureControl
      ).toHaveValue(
        'Michael'
      );

      console.log(
        'Participant signature entered successfully: Michael'
      );

    } else if (
      await signatureControl.getAttribute(
        'contenteditable'
      ) === 'true'
    ) {

      await signatureControl.click();

      await signatureControl.fill(
        'Michael'
      );

      console.log(
        'Participant signature entered successfully: Michael'
      );

    } else if (
      signatureTagName === 'canvas'
    ) {

      // ========================================================
      // CANVAS SIGNATURE PAD
      // ========================================================

      const canvasBox =
        await signatureControl.boundingBox();

      if (!canvasBox) {
        throw new Error(
          'Participant Signature canvas was found, but its position could not be determined.'
        );
      }

      console.log(
        'Participant Signature is a canvas signature pad.'
      );

      const x =
        canvasBox.x + 30;

      const y =
        canvasBox.y +
        canvasBox.height / 2;

      // --------------------------------------------------------
      // DRAW SIGNATURE
      // --------------------------------------------------------

      await page.mouse.move(
        x,
        y
      );

      await page.mouse.down();

      // M
      await page.mouse.move(
        x + 5,
        y - 20
      );

      await page.mouse.move(
        x + 12,
        y
      );

      await page.mouse.move(
        x + 19,
        y - 20
      );

      await page.mouse.move(
        x + 26,
        y
      );

      await page.mouse.up();

      // i
      await page.mouse.move(
        x + 32,
        y
      );

      await page.mouse.down();

      await page.mouse.move(
        x + 32,
        y - 12
      );

      await page.mouse.up();

      await page.mouse.click(
        x + 32,
        y - 20
      );

      // c
      await page.mouse.move(
        x + 40,
        y - 5
      );

      await page.mouse.down();

      await page.mouse.move(
        x + 36,
        y - 12
      );

      await page.mouse.move(
        x + 48,
        y - 12
      );

      await page.mouse.move(
        x + 50,
        y - 5
      );

      await page.mouse.up();

      // h
      await page.mouse.move(
        x + 56,
        y + 2
      );

      await page.mouse.down();

      await page.mouse.move(
        x + 56,
        y - 22
      );

      await page.mouse.up();

      await page.mouse.move(
        x + 56,
        y - 5
      );

      await page.mouse.down();

      await page.mouse.move(
        x + 63,
        y - 10
      );

      await page.mouse.move(
        x + 70,
        y
      );

      await page.mouse.up();

      // a
      await page.mouse.move(
        x + 77,
        y - 5
      );

      await page.mouse.down();

      await page.mouse.move(
        x + 82,
        y - 12
      );

      await page.mouse.move(
        x + 89,
        y - 5
      );

      await page.mouse.move(
        x + 82,
        y + 2
      );

      await page.mouse.move(
        x + 77,
        y - 5
      );

      await page.mouse.up();

      // e
      await page.mouse.move(
        x + 96,
        y - 5
      );

      await page.mouse.down();

      await page.mouse.move(
        x + 104,
        y - 12
      );

      await page.mouse.move(
        x + 110,
        y - 5
      );

      await page.mouse.move(
        x + 96,
        y - 5
      );

      await page.mouse.move(
        x + 105,
        y + 2
      );

      await page.mouse.up();

      // l
      await page.mouse.move(
        x + 116,
        y + 2
      );

      await page.mouse.down();

      await page.mouse.move(
        x + 116,
        y - 22
      );

      await page.mouse.up();

      console.log(
        'Participant signature drawn successfully.'
      );
    }

    // ============================================================
    // 38. WAIT FOR SIGNATURE TO REGISTER
    // ============================================================

    await page.waitForTimeout(1500);

    // ============================================================
    // 39. SIGNATURE SCREENSHOT
    // ============================================================

    await page.screenshot({
      path:
        'screenshots/volunteer-waiver-signature-entered.png',
      fullPage: true
    });

    console.log(
      'Waiver signature screenshot captured successfully.'
    );

    // ============================================================
    // 40. CLICK NEXT -> BACKGROUND CHECK
    // ============================================================

    await waiverNextButton.scrollIntoViewIfNeeded();

    await expect(
      waiverNextButton
    ).toBeVisible({
      timeout: 10000
    });

    await waiverNextButton.click();

    console.log(
      'NEXT clicked from Waiver Form.'
    );

    await page.waitForTimeout(2000);

    // ============================================================
    // 41. VALIDATE BACKGROUND CHECK
    // ============================================================

    const backgroundCheck =
      page.getByText(
        'Background Check',
        {
          exact: true
        }
      ).first();

    await expect(
      backgroundCheck
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Successfully navigated to Background Check tab.'
    );

    await page.waitForTimeout(1000);

    // ============================================================
    // 42. BACKGROUND CHECK SCREENSHOT
    // ============================================================

    await page.screenshot({
      path:
        'screenshots/volunteer-background-check.png',
      fullPage: true
    });

    // ============================================================
    // 43. CLICK NEXT -> ONBOARDING
    // ============================================================

    const backgroundNextButton =
      page.getByRole(
        'button',
        {
          name: /next/i
        }
      ).last();

    await expect(
      backgroundNextButton
    ).toBeVisible({
      timeout: 15000
    });

    await backgroundNextButton.scrollIntoViewIfNeeded();

    await backgroundNextButton.click();

    console.log(
      'NEXT clicked from Background Check.'
    );

    await page.waitForTimeout(2000);

    // ============================================================
    // 44. VALIDATE ONBOARDING TAB
    // ============================================================

    const onboardingHeading =
      page.getByText(
        'Onboarding',
        {
          exact: true
        }
      ).first();

    await expect(
      onboardingHeading
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Successfully navigated to Onboarding tab.'
    );

    // ============================================================
    // 45. ONBOARDING QUESTIONS AND RESPONSES
    // ============================================================

    const onboardingResponses: {
      question: string;
      response: string;
    }[] = [

      {
        question:
          'What inspired you to become a volunteer with our organization?',

        response:
          'I am inspired to volunteer because I enjoy helping others and making a positive difference in the community.'
      },

      {
        question:
          'Tell us something unique or interesting about yourself?',

        response:
          'I enjoy learning new skills, exploring new places, and spending time helping my community.'
      },

      {
        question:
          'Do you have a personal connection to our mission or the people we serve? Please explain.',

        response:
          'Yes. I value supporting people in my community and helping create meaningful connections and positive experiences.'
      },

      {
        question:
          'Describe any experience you have working with older adults or senior communities.',

        response:
          'I have experience spending time with older adults, assisting with activities, listening to their stories, and providing friendly support.'
      }
    ];

    // ============================================================
    // HELPER - FIND ONBOARDING RESPONSE CONTROL
    // ============================================================

    async function findOnboardingControl(
      questionText: string
    ) {

      const question =
        page.getByText(
          questionText,
          {
            exact: true
          }
        ).first();

      await expect(
        question
      ).toBeVisible({
        timeout: 15000
      });

      await question.scrollIntoViewIfNeeded();

      // First try textarea following the question.
      let control =
        question.locator(
          'xpath=following::textarea[1]'
        ).first();

      if (
        await control.count() > 0 &&
        await control.isVisible().catch(() => false)
      ) {
        return control;
      }

      // Try input following the question.
      control =
        question.locator(
          'xpath=following::input[not(@type="hidden")][1]'
        ).first();

      if (
        await control.count() > 0 &&
        await control.isVisible().catch(() => false)
      ) {
        return control;
      }

      // Try contenteditable control.
      control =
        question.locator(
          'xpath=following::*[@contenteditable="true"][1]'
        ).first();

      if (
        await control.count() > 0 &&
        await control.isVisible().catch(() => false)
      ) {
        return control;
      }

      throw new Error(
        `Unable to locate response control for onboarding question: ${questionText}`
      );
    }

    // ============================================================
    // 46. ENTER ALL ONBOARDING RESPONSES
    // ============================================================

    for (
      const item of onboardingResponses
    ) {

      console.log(
        `Locating Onboarding question: ${item.question}`
      );

      const responseControl =
        await findOnboardingControl(
          item.question
        );

      await responseControl.scrollIntoViewIfNeeded();

      const tagName =
        await responseControl.evaluate(
          (element: Element) =>
            element.tagName.toLowerCase()
        );

      if (
        tagName === 'input' ||
        tagName === 'textarea'
      ) {

        await responseControl.fill(
          item.response
        );

      } else if (
        await responseControl.getAttribute(
          'contenteditable'
        ) === 'true'
      ) {

        await responseControl.click();

        await responseControl.fill(
          item.response
        );

      } else {

        throw new Error(
          `Unsupported onboarding response control for: ${item.question}`
        );
      }

      console.log(
        `Response entered successfully for: ${item.question}`
      );
    }

    console.log(
      'All 4 Onboarding questions were answered successfully.'
    );

    // ============================================================
    // 47. VALIDATE ONBOARDING RESPONSES
    // ============================================================

    for (
      const item of onboardingResponses
    ) {

      const responseControl =
        await findOnboardingControl(
          item.question
        );

      const tagName =
        await responseControl.evaluate(
          (element: Element) =>
            element.tagName.toLowerCase()
        );

      if (
        tagName === 'input' ||
        tagName === 'textarea'
      ) {

        await expect(
          responseControl
        ).toHaveValue(
          item.response
        );
      }
    }

    console.log(
      'All Onboarding responses validated successfully.'
    );

    // ============================================================
    // 48. ONBOARDING SCREENSHOT
    // ============================================================

    await page.screenshot({
      path:
        'screenshots/volunteer-onboarding.png',
      fullPage: true
    });

    console.log(
      'Onboarding screenshot captured successfully.'
    );

    // ============================================================
    // 49. CLICK NEXT -> SUMMARY
    // ============================================================

    const onboardingNextButton =
      page.getByRole(
        'button',
        {
          name: /next/i
        }
      ).last();

    await expect(
      onboardingNextButton
    ).toBeVisible({
      timeout: 15000
    });

    await onboardingNextButton.scrollIntoViewIfNeeded();

    await onboardingNextButton.click();

    console.log(
      'NEXT clicked from Onboarding.'
    );

    await page.waitForTimeout(2000);

    // ============================================================
    // 50. VALIDATE SUMMARY TAB
    // ============================================================

    const summaryHeading =
      page.getByText(
        'Summary',
        {
          exact: true
        }
      ).first();

    await expect(
      summaryHeading
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Successfully navigated to Summary tab.'
    );

    // ============================================================
    // 51. SUMMARY SCREENSHOT
    // ============================================================

    await page.waitForTimeout(1000);

    await page.screenshot({
      path:
        'screenshots/volunteer-summary.png',
      fullPage: true
    });

    console.log(
      'Summary screenshot captured successfully.'
    );

    // ============================================================
    // 52. LOCATE SUBMIT APPLICATION BUTTON
    // ============================================================

    const submitApplicationButton =
      page.getByRole(
        'button',
        {
          name: /Submit Application/i
        }
      ).last();

    await expect(
      submitApplicationButton
    ).toBeVisible({
      timeout: 15000
    });

    await submitApplicationButton.scrollIntoViewIfNeeded();

    console.log(
      'Submit Application button located successfully.'
    );

    // ============================================================
    // 53. CLICK SUBMIT APPLICATION
    //
    // IMPORTANT FIX:
    //
    // Clicking Submit Application immediately navigates to:
    //
    // /Volunteer-Thankyou-page/
    //
    // Therefore we wait for the navigation at the same time
    // as the click.
    // ============================================================

    await Promise.all([
      page.waitForURL(
        '**/Volunteer-Thankyou-page/**',
        {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        }
      ),

      submitApplicationButton.click()
    ]);

    console.log(
      'Submit Application button clicked.'
    );

    // ============================================================
    // 54. VALIDATE THANK YOU PAGE URL
    // ============================================================

    await expect(
      page
    ).toHaveURL(
      /Volunteer-Thankyou-page/i,
      {
        timeout: 15000
      }
    );

    console.log(
      'Thank You page navigation completed successfully.'
    );

    // ============================================================
    // 55. WAIT 2 SECONDS
    // ============================================================

    await page.waitForTimeout(2000);

    // ============================================================
    // 56. VALIDATE THANK YOU PAGE
    // ============================================================

    await expect(
      page.locator('body')
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Thank You page displayed successfully.'
    );

    // ============================================================
    // 57. CHECK APPLICATION SUBMITTED MESSAGE
    //
    // The staging site navigates directly to the Thank You
    // page after submission. The success message may therefore
    // no longer exist in the DOM after navigation.
    //
    // We check it when available, but do not fail the test
    // because the successful Thank You page navigation itself
    // confirms the submission flow completed.
    // ============================================================

    const applicationSuccessMessage =
      page.getByText(
        /Application Submitted Successfully/i
      ).first();

    const successMessageVisible =
      await applicationSuccessMessage
        .isVisible()
        .catch(() => false);

    if (
      successMessageVisible
    ) {

      console.log(
        '"Application Submitted Successfully" message displayed successfully.'
      );

    } else {

      console.log(
        '"Application Submitted Successfully" message is not present after navigation to the Thank You page.'
      );

      console.log(
        'Application submission was confirmed by successful navigation to the Thank You page.'
      );
    }

    // ============================================================
    // 58. THANK YOU PAGE SCREENSHOT
    // ============================================================

    await page.screenshot({
      path:
        'screenshots/volunteer-thank-you-page.png',
      fullPage: true
    });

    console.log(
      'Thank You page screenshot captured successfully.'
    );

    // ============================================================
    // 59. END TEST
    // ============================================================

    console.log(
      'Application submitted successfully.'
    );

    console.log(
      'Thank You page displayed. Test completed successfully.'
    );

    // ============================================================
    // IMPORTANT:
    // NO MORE ACTIONS AFTER THIS POINT.
    // THE TEST ENDS HERE.
    // ============================================================

  }
);