<script>
	import mail from '$lib/images/mail.png';
	import github from '$lib/images/github.png';
	import linkedin from '$lib/images/linkedin.png';
</script>

<section class="flex flex-col items-center gap-4">
	<h1 class="mb-4 mt-12 text-center text-6xl font-bold">Eero Lehtinen</h1>
	<div class="flex items-center gap-1">
		<img src={mail} alt="email" class="mt-0.5 max-h-5" />
		<a href="mailto:eero@eerolehtinen.fi">eero@eerolehtinen.fi</a>
	</div>
	<div class="flex gap-4">
		<div class="flex items-center gap-1">
			<img src={github} alt="Github" class="mt-0.5 max-h-5" />
			<a href="https://github.com/eero-lehtinen">Github</a>
		</div>
		<div class="flex items-center gap-1">
			<img src={linkedin} alt="LinkedIn" class="mt-0.5 max-h-5" />
			<a href="https://www.linkedin.com/in/eero-lehtinen/">LinkedIn</a>
		</div>
	</div>
</section>
