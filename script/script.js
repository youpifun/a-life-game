	const ROWS_COUNT = 10;
	const COLUMNS_COUNT = 15;
	let rowsCount = ROWS_COUNT;
	let columnsCount = COLUMNS_COUNT;
	let timerID;
	let fieldMatrix = [[]];
	let fieldMatrixCopy = [[]];
	function createField(length) {
	let arr = new Array(length || 0).fill(0),
			i = length;
		if (arguments.length > 1) {
			let args = Array.prototype.slice.call(arguments, 1);
			while(i--) arr[length-1 - i] = createField.apply(this, args);
		}
		return arr;
	}

	function fillFieldFromFile(input) {
		let reader = new FileReader();
		let file = input.files[0];
		reader.readAsText(file);
		reader.onload = function() {
			let fileContentRows = reader.result.split('\n');
			fieldMatrix = Array(fileContentRows.length); 
			fileContentRows.forEach((row, idx) => {
				fieldMatrix[idx] = row.split(' ').map(Number);
			});
			rowsCount = fieldMatrix.length;
			columnsCount = fieldMatrix.length?fieldMatrix[0].length:0;
			fillField();
		}
	};

	function fillFieldRandomly() {
		fieldMatrix = Array(ROWS_COUNT).fill().map(()=>Array(COLUMNS_COUNT).fill().map(()=>Math.floor(Math.random() * 2)));
		rowsCount = ROWS_COUNT;
		columnsCount = COLUMNS_COUNT;
		fillField();
	}

	function updateField() {
		for (let i = 0; i < columnsCount; i++) {
			for (let j = 0; j < rowsCount; j++) {
				let aliveNeighborCount = getAliveNeighborCount(j,i);
				if (isAlive(j, i) && (aliveNeighborCount<2 || aliveNeighborCount>3))
					killCell(j, i);
				else if (aliveNeighborCount==3)
					restoreCell(j, i);
				setOpacity(j, i);
			}
		}
		fieldMatrix = JSON.parse(JSON.stringify(fieldMatrixCopy));
		console.log(JSON.parse(JSON.stringify(fieldMatrix)));				
	}

	function fillField() {
		clearInterval(timerID);
		let field = document.getElementsByClassName("field")[0];
		field.innerHTML = "";
		for (let i = 0; i < columnsCount; i++) {
			let row = document.createElement("div");
			field.appendChild(row);
			for (let j = 0; j < rowsCount; j++) {
				let cell = document.createElement("div");
				cell.classList.add("green");
				cell.id = 'cell_'+i+'_'+j;
				row.appendChild(cell);
			}
		}
		console.log(JSON.parse(JSON.stringify(fieldMatrix)));
		fieldMatrixCopy = JSON.parse(JSON.stringify(fieldMatrix));
		updateField();
		timerID = setInterval(() => updateField(), 1000);
	}

	function getAliveNeighborCount(j, i) {
		return isAlive(j-1, i)+
			   isAlive(j-1, i-1)+
			   isAlive(j-1, i+1)+
			   isAlive(j, i-1)+
			   isAlive(j, i+1)+
			   isAlive(j+1, i-1)+
			   isAlive(j+1, i)+
			   isAlive(j+1,i+1);
	}

	function isAlive(j, i) {
		if ((i<0)||(j<0)||(j==rowsCount)||(i==columnsCount)) {
			return 0;
		} else
		return fieldMatrix[j][i] == 1;
	}

	function killCell(j, i) {
		fieldMatrixCopy[j][i] = 0;
	}

	function restoreCell(j, i) {
		fieldMatrixCopy[j][i] = 1;
	}

	function setOpacity(j, i) {
		let cell = document.getElementById(`cell_${i}_${j}`);
				if (isAlive(j, i)) {	
					cell.style.opacity = 1;
				} else
				cell.style.opacity = 0.1;
	}