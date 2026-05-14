<script lang="ts">
	import Icon from "@iconify/svelte";

  const services = [
    {
      title: 'Software & Website Development',
      description:
        'Custom software and modern websites built around your workflow, with clean UX, fast delivery, and room to scale.',
      type: 'icon',
      icon: 'material-symbols:code-blocks',
      link: '/services#development',
      accent: 'from-orange-500/20 to-amber-400/20',
      badge: 'Build'
    },
    {
      title: 'Google Workspace',
      description:
        'Setup, licensing, admin support, and user adoption help to keep your team productive and aligned.',
      icon: '/google.png',
      type: 'png',
      link: '/services#google-workspace',
      accent: 'from-sky-500/20 to-cyan-400/20',
      badge: 'Collaborate'
    },
    {
      title: 'Fortinet Equipment',
      description:
        'Network security consulting, hardware sales, and implementation support for a stronger perimeter.',
      icon: '/fortinet.png',
      type: 'png',
      link: '/services#fortinet',
      accent: 'from-emerald-500/20 to-teal-400/20',
      badge: 'Protect'
    }
  ];

  const stats = [
    { value: '3', label: 'core service areas' },
    { value: 'Fast', label: 'response and delivery' },
    { value: 'Local', label: 'business-first support' }
  ];

  const principles = [
    'Straightforward advice without the jargon',
    'Practical solutions that fit how your business works',
    'Implementation support that does not stop at handoff'
  ];
</script>

<svelte:head>
  <title>H2 Technologies | Software, Google Workspace, and Fortinet Support</title>
  <meta
    name="description"
    content="H2 Technologies helps businesses with custom software, website development, Google Workspace administration, and Fortinet security solutions."
  />
</svelte:head>

<section class="relative overflow-hidden bg-slate-950 text-white">
  <div class="absolute inset-0 bg-[url(/herobackground.jpg)] bg-cover bg-center opacity-25"></div>
  <div class="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/70 to-slate-950"></div>
  <div class="relative mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col justify-center px-6 py-16 sm:px-8 lg:px-12">
    <div class="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="max-w-3xl">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-100 backdrop-blur-sm">
          <span class="h-2.5 w-2.5 rounded-full bg-orange-400"></span>
          Technology support for growing businesses
        </div>
        <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
          Modern software, practical support, and security that works in the real world.
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
          H2 Technologies helps businesses build better websites and software, keep teams productive with Google Workspace, and secure their networks with Fortinet solutions.
        </p>
        <div class="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href="https://client-portal.app.intuit.com/contact-form?accountId=249325971&formId=287439"
            class="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-400"
          >
            Start a Project
          </a>
          <a
            href="#services"
            class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Explore Services
          </a>
        </div>
        <div class="mt-10 grid gap-4 sm:grid-cols-3">
          {#each stats as stat}
            <div class="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
              <div class="text-3xl font-semibold text-white">{stat.value}</div>
              <div class="mt-1 text-sm text-slate-300">{stat.label}</div>
            </div>
          {/each}
        </div>
      </div>

      <div class="relative">
        <div class="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-orange-500/15 via-white/5 to-cyan-400/10 blur-3xl"></div>
        <div class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm uppercase tracking-[0.3em] text-slate-400">What we do</p>
              <p class="mt-2 text-xl font-semibold text-white">Built for operations, not just optics</p>
            </div>
            <div class="rounded-2xl bg-white/8 px-4 py-2 text-sm text-slate-200">H2</div>
          </div>
          <div class="mt-8 space-y-4">
            {#each principles as principle, index}
              <div class="flex gap-4 rounded-2xl border border-white/8 bg-white/5 p-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-sm font-semibold text-orange-300">
                  0{index + 1}
                </div>
                <p class="pt-1 text-sm leading-6 text-slate-200">{principle}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="services" class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
  <div class="mx-auto max-w-7xl">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">Services</p>
      <h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        A focused set of services that covers build, productivity, and security.
      </h2>
      <p class="mt-4 text-lg leading-8 text-slate-600">
        Choose one area or combine all three. We can help you modernize a site, support your staff, or tighten up the security layer around your business.
      </p>
    </div>

    <div class="mt-12 grid gap-6 lg:grid-cols-3">
      {#each services as service}
        <article class="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div class={`rounded-3xl bg-gradient-to-br ${service.accent} p-4`}>
            <div class="flex items-center justify-between">
              <span class="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                {service.badge}
              </span>
              <div class="rounded-2xl bg-white/90 p-3 text-slate-950 shadow-sm">
                {#if service.type === 'png'}
                  <img src={service.icon} alt={service.title} class="h-10 w-10 object-contain" />
                {:else}
                  <Icon icon={service.icon} class="h-10 w-10" />
                {/if}
              </div>
            </div>
          </div>
          <h3 class="mt-6 text-2xl font-semibold tracking-tight">{service.title}</h3>
          <p class="mt-3 leading-7 text-slate-600">{service.description}</p>
          <a
            href={service.link}
            class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition group-hover:gap-3"
          >
            Learn more
            <span aria-hidden="true">→</span>
          </a>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="bg-white px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
  <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">Why H2</p>
      <h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        A partner that keeps the work practical.
      </h2>
      <p class="mt-4 text-lg leading-8 text-slate-600">
        You get clear communication, hands-on implementation, and recommendations that match the size and pace of your business.
      </p>
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-[1.75rem] bg-slate-950 p-6 text-white sm:col-span-1">
        <p class="text-sm uppercase tracking-[0.2em] text-slate-400">Support</p>
        <p class="mt-3 text-xl font-semibold">One point of contact</p>
        <p class="mt-3 text-sm leading-6 text-slate-300">Keep projects, admin, and security aligned instead of juggling multiple vendors.</p>
      </div>
      <div class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 sm:col-span-2">
        <p class="text-sm uppercase tracking-[0.2em] text-slate-500">Approach</p>
        <div class="mt-4 grid gap-3">
          {#each principles as principle}
            <div class="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <span class="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500"></span>
              <p class="text-sm leading-6 text-slate-700">{principle}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
  <div class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur sm:p-10 lg:flex-row lg:items-center">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">Get started</p>
      <h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Tell us what you are trying to improve and we will map the next step.
      </h2>
      <p class="mt-4 text-lg leading-8 text-slate-300">
        Whether you need a new site, help with Google Workspace, or a security upgrade, we can scope the work and keep the path simple.
      </p>
    </div>
    <a
      href="https://client-portal.app.intuit.com/contact-form?accountId=249325971&formId=287439"
      class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-orange-100"
    >
      Contact H2 Technologies
    </a>
  </div>
</section>