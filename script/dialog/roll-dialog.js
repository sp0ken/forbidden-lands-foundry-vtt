import DiceRoller from "../components/dice-roller.js";

export class RollDialog {
    
    /**
     * Display roll dialog and execute the roll.
     * 
     * @param  {string} rollName
     * @param  {object} baseDefault {name: "somename", value: 5}
     * @param  {object} skillDefault {name: "somename", value: 5}
     * @param  {number} gearDefault
     * @param  {string} artifactDefault
     * @param  {number} modifierDefault
     * @param  {number} damage
     * @param  {DiceRoller} [diceRoller]
     * @param  {callback} [onAfterRoll]
     */
    static prepareRollDialog(rollName, baseDefault, skillDefault, gearDefault, artifactDefault, modifierDefault, damage, diceRoller, onAfterRoll) {
        diceRoller = diceRoller || new DiceRoller();
        onAfterRoll = onAfterRoll || function () {};

        if (typeof baseDefault !== 'object') baseDefault = { name: "Base", value: baseDefault };
        if (typeof skillDefault !== 'object') skillDefault = { name: "Skill", value: skillDefault };

        let baseHtml = this.buildInputHtmlDialog(baseDefault.name, baseDefault.value);
        let skillHtml = this.buildInputHtmlDialog(skillDefault.name, skillDefault.value);
        let gearHtml = this.buildInputHtmlDialog("Gear", gearDefault);
        let artifactHtml = this.buildInputHtmlDialog("Artifacts", artifactDefault);
        let modifierHtml = this.buildInputHtmlDialog("Modifier", modifierDefault);

        let d = new Dialog({
            title: "Roll : " + rollName,
            content: this.buildDivHtmlDialog(baseHtml + skillHtml + gearHtml + artifactHtml + modifierHtml),
            buttons: {
                roll: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Roll",
                    callback: (html) => {
                        let base = html.find('#' + baseDefault.name.toLowerCase())[0].value;
                        let skill = html.find('#' + skillDefault.name.toLowerCase())[0].value;
                        let gear = html.find('#gear')[0].value;
                        let artifact = this.parseArtifact(html.find('#artifacts')[0].value);
                        let modifier = html.find('#modifier')[0].value;
                        diceRoller.roll(
                            rollName,
                            parseInt(base, 10),
                            parseInt(skill, 10),
                            parseInt(gear, 10), 
                            artifact,
                            parseInt(modifier, 10),
                            parseInt(damage, 10)
                        );
                        onAfterRoll(diceRoller);
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel",
                    callback: () => {}
                }
            },
            default: "roll",
            close: () => {}
        });
        d.render(true);
    }
    
    /**
     * @param  {string} divContent
     */
    static buildDivHtmlDialog(divContent) {
        return "<div class='flex row roll-dialog'>" + divContent + "</div>";
    }

    /**
     * @param  {string} diceName
     * @param  {number} diceValue
     */
    static buildInputHtmlDialog(diceName, diceValue) {
        return "<b>" + diceName + "</b><input id='" + diceName.toLowerCase() + "' style='text-align: center' type='text' value='" + diceValue + "'/>";
    }

    /**
     * Parse artifact dice string
     * 
     * @param  {string} artifact
     */
    static parseArtifact(artifact) {
        let regex = /([0-9]*)d([0-9]*)/g;
        let regexMatch;
        let artifacts = [];
        while (regexMatch = regex.exec(artifact)) {
            artifacts.push({dice: +regexMatch[1] || 1, face: +regexMatch[2]});
        }
        return artifacts;
    }
}