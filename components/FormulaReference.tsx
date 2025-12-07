import React from 'react';
import { BookOpen, Calculator, Wind, Zap, FlaskConical, Hammer, Layers } from 'lucide-react';

const FormulaReference: React.FC = () => {
  const categories = [
    {
      title: "Количество вещества",
      icon: <Calculator size={20} className="text-blue-500" />,
      color: "bg-blue-50 border-blue-100",
      formulas: [
        { name: "Через массу", eq: "n = m / M", desc: "n - моль, m - масса (г), M - молярная масса (г/моль)" },
        { name: "Через объем (газы н.у.)", eq: "n = V / Vm", desc: "Vm = 22.4 л/моль (при н.у.)" },
        { name: "Через число частиц", eq: "n = N / Na", desc: "Na = 6.02 × 10²³ моль⁻¹" }
      ]
    },
    {
      title: "Газовые законы",
      icon: <Wind size={20} className="text-cyan-500" />,
      color: "bg-cyan-50 border-cyan-100",
      formulas: [
        { name: "Уравнение Менделеева-Клапейрона", eq: "PV = nRT", desc: "R = 8.314 Дж/(моль·К)" },
        { name: "Закон Бойля-Мариотта", eq: "P₁V₁ = P₂V₂", desc: "T = const" },
        { name: "Закон Шарля", eq: "V₁/T₁ = V₂/T₂", desc: "P = const" }
      ]
    },
    {
      title: "Растворы",
      icon: <FlaskConical size={20} className="text-purple-500" />,
      color: "bg-purple-50 border-purple-100",
      formulas: [
        { name: "Массовая доля", eq: "ω = m(в-ва) / m(р-ра) × 100%", desc: "" },
        { name: "Молярная концентрация", eq: "C = n / V", desc: "моль/л" },
        { name: "Плотность раствора", eq: "ρ = m / V", desc: "г/мл или г/см³" },
        { name: "Правило смешения (Крест)", eq: "m₁/m₂ = (ω₃ - ω₂) / (ω₁ - ω₃)", desc: "Для задач на разбавление/смешение" }
      ]
    },
    {
      title: "Термодинамика и Кинетика",
      icon: <Zap size={20} className="text-amber-500" />,
      color: "bg-amber-50 border-amber-100",
      formulas: [
        { name: "Энтальпия реакции", eq: "ΔH = ΣH(прод) - ΣH(реаг)", desc: "" },
        { name: "Закон Вант-Гоффа", eq: "v₂ = v₁ · γ^((T₂-T₁)/10)", desc: "Скорость реакции при изменении T" },
        { name: "pH", eq: "pH = -lg[H⁺]", desc: "" }
      ]
    },
    {
      title: "Металлургия и Электролиз",
      icon: <Hammer size={20} className="text-slate-600" />,
      color: "bg-slate-100 border-slate-200",
      formulas: [
        { name: "Закон Фарадея (объединенный)", eq: "m = (M · I · t) / (n · F)", desc: "F = 96485 Кл/моль, n - число электронов" },
        { name: "Выход по току (η)", eq: "η = m(практ) / m(теор) · 100%", desc: "Эффективность процесса" },
        { name: "Массовая доля металла в руде", eq: "ω(Me) = (n·Ar(Me) / Mr(руды)) · 100%", desc: "Расчет чистого металла" }
      ]
    },
    {
      title: "Важнейшие Сплавы",
      icon: <Layers size={20} className="text-rose-500" />,
      color: "bg-rose-50 border-rose-100",
      formulas: [
        { name: "Латунь (Brass)", eq: "Cu + Zn", desc: "До 45% цинка. Детали машин, трубы." },
        { name: "Бронза (Bronze)", eq: "Cu + Sn", desc: "Медь с оловом (иногда Al, Si). Памятники, арматура." },
        { name: "Сталь (Steel)", eq: "Fe + C (< 2.14%)", desc: "Конструкционный материал." },
        { name: "Чугун (Cast Iron)", eq: "Fe + C (> 2.14%)", desc: "Тяжелое машиностроение, батареи." },
        { name: "Дюралюминий", eq: "Al + Cu + Mg", desc: "Авиастроение (легкий и прочный)." },
        { name: "Мельхиор", eq: "Cu + Ni", desc: "Посуда, монеты, медицинские инструменты." }
      ]
    }
  ];

  return (
    <div className="space-y-8">
       <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
          <BookOpen size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Справочник формул</h2>
          <p className="text-slate-500">Формулы и данные для решения задач</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className={`rounded-2xl p-6 border ${cat.color} hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-3 mb-4">
              {cat.icon}
              <h3 className="font-bold text-lg text-slate-800">{cat.title}</h3>
            </div>
            <div className="space-y-4">
              {cat.formulas.map((f, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm group">
                   <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-medium text-slate-500 group-hover:text-slate-800 transition-colors">{f.name}</span>
                   </div>
                   <div className="font-mono text-lg font-bold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg inline-block w-full text-center">
                     {f.eq}
                   </div>
                   {f.desc && <p className="text-xs text-slate-400 mt-2 italic text-center">{f.desc}</p>}
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
