<script>
	import mail from "$lib/images/mail.png"
	import github from "$lib/images/github.png"
	import linkedin from "$lib/images/linkedin.png"
</script>

<section class="flex flex-col items-center gap-4">
	<h1 class="mb-4 mt-12 text-center text-6xl font-bold">Eero Lehtinen</h1>
	<a class="flex items-center gap-2" href="mailto:eero@eerolehtinen.fi">
		<img src={mail} alt="Email" width="24" height="24" />
		eero@eerolehtinen.fi
	</a>
	<div class="flex gap-5">
		<a class="flex items-center gap-2" href="https://github.com/eero-lehtinen">
			<img src={github} alt="Github" width="24" height="24" />
			<span>Github</span>
		</a>
		<a
			class="flex items-center gap-2"
			href="https://www.linkedin.com/in/eero-lehtinen/"
		>
			<img src={linkedin} alt="LinkedIn" width="24" height="24" />
			<span>LinkedIn</span>
		</a>
	</div>
</section>
