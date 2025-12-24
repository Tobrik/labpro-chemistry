import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Calculator, Wind, Zap, FlaskConical, Hammer, Layers } from 'lucide-react';

const FormulaReference: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    {
      title: t('formulaReference.amountOfSubstance'),
      icon: <Calculator size={20} className="text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-zinc-600",
      formulas: [
        { name: t('formulaReference.throughMass'), eq: "n = m / M", desc: t('formulaReference.throughMassDesc') },
        { name: t('formulaReference.throughVolume'), eq: "n = V / Vm", desc: t('formulaReference.throughVolumeDesc') },
        { name: t('formulaReference.throughParticles'), eq: "n = N / Na", desc: t('formulaReference.throughParticlesDesc') }
      ]
    },
    {
      title: t('formulaReference.gasLaws'),
      icon: <Wind size={20} className="text-cyan-500" />,
      color: "bg-cyan-50 dark:bg-cyan-900/30 border-cyan-100 dark:border-zinc-600",
      formulas: [
        { name: t('formulaReference.mendelClapeyron'), eq: "PV = nRT", desc: t('formulaReference.mendelClapeyronDesc') },
        { name: t('formulaReference.boyleMariotte'), eq: "P₁V₁ = P₂V₂", desc: t('formulaReference.boyleMariotteDesc') },
        { name: t('formulaReference.charlesLaw'), eq: "V₁/T₁ = V₂/T₂", desc: t('formulaReference.charlesLawDesc') }
      ]
    },
    {
      title: t('formulaReference.solutions'),
      icon: <FlaskConical size={20} className="text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-zinc-600",
      formulas: [
        { name: t('formulaReference.massFraction'), eq: "ω = m(в-ва) / m(р-ра) × 100%", desc: t('formulaReference.massFractionDesc') },
        { name: t('formulaReference.molarConcentration'), eq: "C = n / V", desc: t('formulaReference.molarConcentrationDesc') },
        { name: t('formulaReference.solutionDensity'), eq: "ρ = m / V", desc: t('formulaReference.solutionDensityDesc') },
        { name: t('formulaReference.mixingRule'), eq: "m₁/m₂ = (ω₃ - ω₂) / (ω₁ - ω₃)", desc: t('formulaReference.mixingRuleDesc') }
      ]
    },
    {
      title: t('formulaReference.thermodynamicsKinetics'),
      icon: <Zap size={20} className="text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-zinc-600",
      formulas: [
        { name: t('formulaReference.reactionEnthalpy'), eq: "ΔH = ΣH(прод) - ΣH(реаг)", desc: t('formulaReference.reactionEnthalpyDesc') },
        { name: t('formulaReference.vantHoffLaw'), eq: "v₂ = v₁ · γ^((T₂-T₁)/10)", desc: t('formulaReference.vantHoffLawDesc') },
        { name: t('formulaReference.phScale'), eq: "pH = -lg[H⁺]", desc: t('formulaReference.phScaleDesc') }
      ]
    },
    {
      title: t('formulaReference.metallurgyElectrolysis'),
      icon: <Hammer size={20} className="text-slate-600 dark:text-slate-300" />,
      color: "bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-zinc-600",
      formulas: [
        { name: t('formulaReference.faradayLaw'), eq: "m = (M · I · t) / (n · F)", desc: t('formulaReference.faradayLawDesc') },
        { name: t('formulaReference.currentEfficiency'), eq: "η = m(практ) / m(теор) · 100%", desc: t('formulaReference.currentEfficiencyDesc') },
        { name: t('formulaReference.metalMassFraction'), eq: "ω(Me) = (n·Ar(Me) / Mr(руды)) · 100%", desc: t('formulaReference.metalMassFractionDesc') }
      ]
    },
    {
      title: t('formulaReference.importantAlloys'),
      icon: <Layers size={20} className="text-rose-500" />,
      color: "bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-zinc-600",
      formulas: [
        { name: t('formulaReference.brass'), eq: "Cu + Zn", desc: t('formulaReference.brassDesc') },
        { name: t('formulaReference.bronze'), eq: "Cu + Sn", desc: t('formulaReference.bronzeDesc') },
        { name: t('formulaReference.steel'), eq: "Fe + C (< 2.14%)", desc: t('formulaReference.steelDesc') },
        { name: t('formulaReference.castIron'), eq: "Fe + C (> 2.14%)", desc: t('formulaReference.castIronDesc') },
        { name: t('formulaReference.duralumin'), eq: "Al + Cu + Mg", desc: t('formulaReference.duraluminDesc') },
        { name: t('formulaReference.cupronickel'), eq: "Cu + Ni", desc: t('formulaReference.cupronickelDesc') }
      ]
    }
  ];

  return (
    <div className="space-y-8">
       <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors">
          <BookOpen size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 transition-colors">{t('formulaReference.title')}</h2>
          <p className="text-slate-500 dark:text-zinc-400 transition-colors">{t('formulaReference.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className={`rounded-2xl p-6 border ${cat.color} hover:shadow-md transition-all`}>
            <div className="flex items-center gap-3 mb-4">
              {cat.icon}
              <h3 className="font-bold text-lg text-slate-800 dark:text-zinc-100 transition-colors">{cat.title}</h3>
            </div>
            <div className="space-y-4">
              {cat.formulas.map((f, i) => (
                <div key={i} className="bg-white dark:bg-zinc-700 p-3 rounded-xl border border-slate-100 dark:border-zinc-600 shadow-sm group transition-colors">
                   <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-medium text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-zinc-100 transition-colors">{f.name}</span>
                   </div>
                   <div className="font-mono text-lg font-bold text-slate-800 dark:text-zinc-100 bg-slate-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg inline-block w-full text-center transition-colors">
                     {f.eq}
                   </div>
                   {f.desc && <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2 italic text-center transition-colors">{f.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormulaReference;
