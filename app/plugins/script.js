'use strict'

let cells = [];
const playerIndex = 0;
const computerIndex = 1;
let playerMove = 0;

function name() {
    var doc = prompt("Enter name:", "Игрок");
    document.getElementById("name").innerHTML = doc;

}

function playerNext() {
    playerMove = (playerMove + 1) % 2;

    let hitDetect = true;
    let i = 0;
    if (playerMove == computerIndex) {
        while (hitDetect && i < 100) {
            i++;
            const accessibleCell = fields[playerIndex].calcAccessibleCells();
            const accessibleIndex = Math.floor(Math.random() * accessibleCell.length);
            const accessibleElem = accessibleCell[accessibleIndex];
            hitDetect = fields[playerIndex].fire(accessibleElem.x, accessibleElem.y);
        }

        playerNext();
    }
}

function generateCells() {
    let fieldCells = document.querySelectorAll('.field__cells');
    for (let j = 0; j < fieldCells.length; j++) {
        cells[j] = [];
        for (let x = 0; x < 10; x++) {
            cells[j][x] = [];
            for (let y = 0; y < 10; y++) {
                var cellElem = document.createElement('div');
                cellElem.className = 'field__cell';

                if (j == computerIndex)
                    cellElem.addEventListener('click', () => { clickCell(j, x, y) });

                fieldCells[j].appendChild(cellElem);
                cells[j][x][y] = cellElem;
            }
        }
    }
}

function clickCell(fieldIndex, x, y) {
    if (fieldIndex == computerIndex) {
        const fire = fields[fieldIndex].fire(x, y);

        if (!fire) {
            playerNext();
        }
    }
}

class FieldShips {
    constructor() {
        this.fieldVisible = false;
        this.fieldIndex = 0;
        this.arrayField = [];
        this.ships = [];
        this.accessibleField = [];
        this.accessibleFieldChange();
    }

    calcAccessibleCells() {
        let accessibleCell = [];
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (this.shootAccess(x, y)) {
                    accessibleCell.push({ x, y });
                }
            }
        }
        return accessibleCell;
    }

    shootAccess(x, y) {
        if (this.arrayField[x][y] >= 0) {
            return true;
        }

        return false;
    }

    generateLabel(x, y) {
        if (this.arrayField[x][y] == -1) {
            const XElem = document.createElement('div');
            XElem.className = 'field__X';
            XElem.innerHTML = 'X';
            cells[this.fieldIndex][x][y].appendChild(XElem);
        }

        if (this.arrayField[x][y] == -2) {
            const OElem = document.createElement('div');
            OElem.className = 'field__O';
            OElem.innerHTML = 'O';
            cells[this.fieldIndex][x][y].appendChild(OElem);
        }
    }

    fire(x, y) {
        if (this.shootAccess(x, y)) {
            if (this.arrayField[x][y] > 0) {
                this.arrayField[x][y] = -1;

                this.generateLabel(x, y);
            } else if (this.arrayField[x][y] == 0) {
                this.arrayField[x][y] = -2;
                this.generateLabel(x, y);
                return false;
            }


            for (let k = 0; k < this.ships.length; k++) {
                let shipPartCount = 0;
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        if (this.arrayField[i][j] > 0 && this.arrayField[i][j] == k + 1) {
                            shipPartCount++;
                        }
                    }
                }

                if (shipPartCount == 0 && !this.ships[k].isDead) {
                    const range = this.spaceRequired(this.ships[k]);
                    for (let rangeX = range.startX; rangeX < range.endX; rangeX++) {
                        for (let rangeY = range.startY; rangeY < range.endY; rangeY++) {
                            if (this.arrayField[rangeY][rangeX] >= 0) {
                                this.arrayField[rangeY][rangeX] = -2;
                                this.generateLabel(rangeY, rangeX);
                            }
                        }
                    }
                    this.ships[k].isDead = true;
                    this.ships[k].isVisible = true;
                    this.generateShip(this.ships[k]);
                    break;
                }

            }

            let won = true;

            for (let i = 0; i < this.ships.length; i++) {
                if (!this.ships[i].isDead) {
                    won = false;
                    break;
                }
            }

            if (won) {
                alert('won');
            }
            return true;
        }
        return true;
    }

    generateShips() {
        for (let i = 0; i < this.ships.length; i++) {
            const ship = this.ships[i];
            this.generateShip(ship);
        }
    }

    generateShip(ship) {
        let sizeX, sizeY;
        if (ship.dir == 0)
            sizeY = ship.size;
        else
            sizeY = 1;

        if (ship.dir == 1)
            sizeY = ship.size;
        else
            sizeY = 1;

        for (let k = ship.x; k < ship.x + sizeX; k++) {
            for (let l = ship.y; l < ship.y + sizeY; l++) {
                cells[this.fieldIndex][l][k].classList.add('field__ship');
            }
        }
    }

    createFieldArray() {
        for (let i = 0; i < 10; i++) {
            this.arrayField[i] = [];
            for (let j = 0; j < 10; j++) {
                this.arrayField[i][j] = 0;
            }
        }

        for (let i = 0; i < this.ships.length; i++) {
            const ship = this.ships[i];
            let sizeX, sizeY;

            if (ship.dir == 0)
                sizeX = ship.size;
            else
                sizeX = 1;

            if (ship.dir == 1)
                sizeY = ship.size;
            else
                sizeY = 1;

            for (let k = ship.x; k < ship.x + sizeX; k++) {
                for (let l = ship.y; l < ship.y + sizeY; l++) {
                    this.arrayField[l][k] = i + 1;
                }
            }
        }
    }

    spaceRequired(ship) {
        let sizeX, sizeY, startX, startY, endX, endY;
        if (ship.dir == 0)
            sizeX = ship.size;
        else
            sizeX = 1;

        if (ship.dir == 1)
            sizeY = ship.size;
        else
            sizeY = 1;

        if (ship.x - 1 >= 0)
            startX = ship.x - 1;
        else
            startX = 0;

        if (ship.y - 1 >= 0)
            startY = ship.y - 1;
        else
            startY = 0;

        if (ship.x + sizeX + 1 < 10)
            endX = ship.x + sizeX + 1;
        else
            endX = 10;

        if (ship.y + sizeY + 1 < 10)
            endY = ship.y + sizeY + 1;
        else
            endY = 10;

        return { startX, startY, endX, endY };
    }

    shipsPositioning() {
        this.ships = [];
        for (let size = 4; size >= 1; size--) {
            for (let count = 0; count < 5 - size; count++) {
                let arrange = false;

                while (!arrange) {
                    const ship = ({
                        x: Math.floor(Math.random() * 10),
                        y: Math.floor(Math.random() * 10),
                        dir: Math.round(Math.random()),
                        size,
                        isVisible: this.fieldVisible,
                        isDead: false
                    });

                    if (this.accessCheck(ship)) {
                        this.pushShips(ship);
                        arrange = true;
                    }

                }
            }
        }
        this.createFieldArray();
    }

    pushShips(...ships) {
        for (let i in ships) {
            if (!this.ships.includes(ships[i])) this.ships.push(ships[i]);
        }
        this.accessibleFieldChange();
    }

    accessCheck(ship) {
        if (
            (ship.dir == 0 && ship.x + ship.size > 10) ||
            (ship.dir == 1 && ship.y + ship.size > 10)
        )
            return false;
        let arrayField = this.accessibleField;
        if (arrayField == null) {
            arrayField = this.accessibleFieldChange();
        }
        if (ship.dir == 0)
            for (let i = 0; i < ship.size; i++) {
                if (!arrayField[ship.x + i][ship.y]) return false;
            }
        else
            for (let i = 0; i < ship.size; i++) {
                if (!arrayField[ship.x][ship.y + i]) return false;
            }
        return true;
    }

    accessibleFieldChange() {
        let arrayField = [];
        for (let i = 0; i < 11; i++) {
            arrayField[i] = [];
            for (let j = 0; j < 11; j++) {
                arrayField[i][j] = true;
            }
        }
        for (let i = 0; i < this.ships.length; i++) {
            const ship = this.ships[i];
            const range = this.spaceRequired(ship);
            for (let k = range.startX; k < range.endX; k++) {
                for (let l = range.startY; l < range.endY; l++) {
                    arrayField[k][l] = false;
                }
            }
        }
        this.accessibleField = arrayField;
        return arrayField;
    }
}

generateCells();

let fields = [];
for (let i = 0; i < 2; i++) {
    const field = new FieldShips();
    field.fieldIndex = i;
    this.fieldVisible = i == playerIndex;
    field.shipsPositioning();

    if (i == playerIndex)
        field.generateShips();
    fields.push(field);
}
name()