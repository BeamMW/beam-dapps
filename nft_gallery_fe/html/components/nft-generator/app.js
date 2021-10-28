import triangles from './figure.js';

const cnvs = document.createElement('canvas');
cnvs.width = 400;
cnvs.height = 400;

const colorSettings = tr_hash => {
	const colorSteps = [];
	for (let start = 0; start < 17; start += 8) {
		let summ = 0;
		for (let k = start; k < start + 8; k++) {
			summ += 2 ** k;
		}
		colorSteps.push(parseInt(tr_hash & BigInt(`${summ}`)) >> start);
	}
	return colorSteps;
};

const triangleRender = (ctx, { a, b, c }, color = 'blue') => {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.moveTo(a[0], a[1]);
	ctx.lineTo(b[0], b[1]);
	ctx.moveTo(b[0], b[1]);
	ctx.lineTo(c[0], c[1]);
	ctx.moveTo(c[0], c[1]);
	ctx.lineTo(a[0], a[1]);
	ctx.stroke();
};

function getBase64Image(canvas) {
	const dataURL = canvas.toDataURL("image/png");
	return dataURL;
}

const drawing = (hash, canvas = cnvs) => {
	if (!isNaN(hash)) {
    const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, 400, 400);
		const tr_hash = BigInt(hash);
		const triangles_points = triangles.map(el =>
			el.map(el => el.map(el => parseFloat(el)))
		);
		const start_color = [1, 1, 1];
		const color_steps = colorSettings(tr_hash);
		if (color_steps[0] === 0) {
			for (let i = 0; i < 3; i++) {
				color_steps[i] = 5;
				start_color[i] = 50;
			}
		}
		for (let j = 0; j < triangles_points.length; j++) {
			if (parseInt(tr_hash & BigInt(2 ** (j + 8))) === 0) continue;
			const new_triangles = triangles_points[j];
			for (let i = 0; i < 3; i++) {
				new_triangles[i][0] += 200;
				new_triangles[i][1] = 200 - new_triangles[i][1];
			}
			const [a, b, c] = new_triangles;
			triangleRender(
				ctx,
				{ a, b, c },
				`rgba(${start_color[0]}, ${start_color[1]}, ${start_color[2]})`
			);
			for (let i = 0; i < 3; i++) {
				const col = parseInt((start_color[i] += color_steps[i]));
				start_color[i] = col < 0 ? 0 : col > 255 ? 255 : col;
			}
		}
	}
	return getBase64Image(canvas);
};

export default drawing;
